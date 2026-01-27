package com.licoreria.service;

import com.licoreria.dto.ApiResponse;
import com.licoreria.dto.ClienteDTO;
import com.licoreria.dto.ProductoDTO;
import com.licoreria.dto.UsuarioDTO;
import com.licoreria.dto.venta.*;
import com.licoreria.entity.*;
import com.licoreria.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VentaService {

    private final VentaRepository ventaRepository;
    private final ProductoRepository productoRepository;
    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;
    private final MovimientoInventarioRepository movimientoInventarioRepository;
    private final PromocionRepository promocionRepository;

    private static final BigDecimal IGV_RATE = new BigDecimal("0.18"); // 18% IGV

    @Transactional
    public ApiResponse<VentaDTO> crear(CrearVentaRequest request) {
        // Obtener usuario actual
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Validar y obtener cliente si existe
        Cliente cliente = null;
        if (request.getClienteId() != null) {
            cliente = clienteRepository.findById(request.getClienteId())
                    .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        }

        // Validar productos y stock
        List<DetalleVenta> detalles = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;

        for (CrearVentaRequest.ItemVenta item : request.getItems()) {
            Producto producto = productoRepository.findById(item.getProductoId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + item.getProductoId()));

            if (!producto.getActivo()) {
                return ApiResponse.error("INVALID", "El producto " + producto.getNombre() + " está inactivo");
            }

            if (producto.getStockActual() < item.getCantidad()) {
                return ApiResponse.error("INSUFFICIENT_STOCK", 
                    "Stock insuficiente para " + producto.getNombre() + 
                    ". Disponible: " + producto.getStockActual() + ", Solicitado: " + item.getCantidad());
            }

            BigDecimal precioUnitario = item.getPrecioUnitario() != null 
                    ? item.getPrecioUnitario() 
                    : producto.getPrecioVenta();

            // Aplicar promociones (simplificado - se puede mejorar)
            BigDecimal descuentoItem = calcularDescuento(producto, item.getCantidad(), precioUnitario);
            BigDecimal subtotalItem = precioUnitario
                    .multiply(new BigDecimal(item.getCantidad()))
                    .subtract(descuentoItem);

            DetalleVenta detalle = DetalleVenta.builder()
                    .producto(producto)
                    .cantidad(item.getCantidad())
                    .precioUnitario(precioUnitario)
                    .descuento(descuentoItem)
                    .subtotal(subtotalItem)
                    .build();

            detalles.add(detalle);
            subtotal = subtotal.add(subtotalItem);
        }

        // Aplicar descuento general si existe
        BigDecimal descuento = request.getDescuento() != null 
                ? request.getDescuento() 
                : BigDecimal.ZERO;
        
        BigDecimal subtotalConDescuento = subtotal.subtract(descuento);
        if (subtotalConDescuento.compareTo(BigDecimal.ZERO) < 0) {
            subtotalConDescuento = BigDecimal.ZERO;
        }

        // Calcular IGV y total
        BigDecimal impuesto = subtotalConDescuento.multiply(IGV_RATE)
                .setScale(2, RoundingMode.HALF_UP);
        BigDecimal total = subtotalConDescuento.add(impuesto);

        // Generar número de venta
        String numeroVenta = generarNumeroVenta();

        // Crear venta
        Venta venta = Venta.builder()
                .numeroVenta(numeroVenta)
                .fecha(Instant.now())
                .usuario(usuario)
                .cliente(cliente)
                .subtotal(subtotal)
                .descuento(descuento)
                .impuesto(impuesto)
                .total(total)
                .formaPago(Venta.FormaPago.valueOf(request.getFormaPago()))
                .estado(Venta.Estado.COMPLETADA)
                .observaciones(request.getObservaciones())
                .build();

        // Asignar venta a detalles
        final Venta ventaFinal = venta;
        detalles.forEach(d -> d.setVenta(ventaFinal));
        venta.setDetalles(detalles);

        // Guardar venta
        venta = ventaRepository.save(venta);

        // Actualizar stock y crear movimientos de inventario
        for (DetalleVenta detalle : detalles) {
            Producto producto = detalle.getProducto();
            int stockAnterior = producto.getStockActual();
            producto.setStockActual(stockAnterior - detalle.getCantidad());
            productoRepository.save(producto);

            // Crear movimiento de inventario
            MovimientoInventario movimiento = MovimientoInventario.builder()
                    .producto(producto)
                    .tipoMovimiento(MovimientoInventario.TipoMovimiento.SALIDA)
                    .cantidad(detalle.getCantidad())
                    .motivo("Venta #" + numeroVenta)
                    .usuario(usuario)
                    .venta(venta)
                    .build();
            movimientoInventarioRepository.save(movimiento);
        }

        return ApiResponse.ok(toDto(venta));
    }

    private BigDecimal calcularDescuento(Producto producto, Integer cantidad, BigDecimal precioUnitario) {
        // Obtener promociones activas para el producto
        List<Promocion> promociones = promocionRepository.findPromocionesActivasByProducto(
                producto.getId(), 
                LocalDateTime.now()
        );

        BigDecimal descuentoTotal = BigDecimal.ZERO;

        for (Promocion promocion : promociones) {
            BigDecimal descuentoPromocion = BigDecimal.ZERO;

            switch (promocion.getTipo()) {
                case DESCUENTO_PORCENTAJE:
                    if (promocion.getDescuentoPorcentaje() != null) {
                        descuentoPromocion = precioUnitario
                                .multiply(promocion.getDescuentoPorcentaje())
                                .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP)
                                .multiply(new BigDecimal(cantidad));
                    }
                    break;
                case DESCUENTO_MONTO:
                    if (promocion.getDescuentoMonto() != null) {
                        descuentoPromocion = promocion.getDescuentoMonto()
                                .multiply(new BigDecimal(cantidad));
                    }
                    break;
                case CANTIDAD:
                    // Implementar lógica 2x1, 3x2, etc.
                    // Por ahora se omite
                    break;
            }

            if (descuentoPromocion.compareTo(descuentoTotal) > 0) {
                descuentoTotal = descuentoPromocion;
            }
        }

        return descuentoTotal;
    }

    private String generarNumeroVenta() {
        String fecha = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        long count = ventaRepository.count();
        return "V-" + fecha + "-" + String.format("%05d", count + 1);
    }

    public ApiResponse<Page<VentaDTO>> listar(
            Instant fechaDesde, 
            Instant fechaHasta, 
            Long usuarioId, 
            Long clienteId,
            String estado,
            Pageable pageable
    ) {
        Page<Venta> page;

        if (fechaDesde != null && fechaHasta != null) {
            page = ventaRepository.findByFechaBetween(fechaDesde, fechaHasta, pageable);
        } else if (usuarioId != null) {
            page = ventaRepository.findByUsuarioId(usuarioId, pageable);
        } else if (clienteId != null) {
            page = ventaRepository.findByClienteId(clienteId, pageable);
        } else if (estado != null) {
            page = ventaRepository.findByEstado(Venta.Estado.valueOf(estado), pageable);
        } else {
            page = ventaRepository.findAll(pageable);
        }

        return ApiResponse.ok(page.map(this::toDto));
    }

    public ApiResponse<VentaDTO> obtenerPorId(Long id) {
        return ventaRepository.findByIdWithDetalles(id)
                .map(v -> ApiResponse.ok(toDto(v)))
                .orElse(ApiResponse.error("NOT_FOUND", "Venta no encontrada"));
    }

    @Transactional
    public ApiResponse<VentaDTO> anular(Long id, String motivo) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Solo ADMIN puede anular
        if (usuario.getRol() != Usuario.Rol.ADMIN) {
            return ApiResponse.error("FORBIDDEN", "Solo administradores pueden anular ventas");
        }

        Venta venta = ventaRepository.findByIdWithDetalles(id)
                .orElseThrow(() -> new RuntimeException("Venta no encontrada"));

        if (venta.getEstado() == Venta.Estado.ANULADA) {
            return ApiResponse.error("INVALID", "La venta ya está anulada");
        }

        // Restaurar stock
        for (DetalleVenta detalle : venta.getDetalles()) {
            Producto producto = detalle.getProducto();
            producto.setStockActual(producto.getStockActual() + detalle.getCantidad());
            productoRepository.save(producto);

            // Crear movimiento de inventario de ajuste
            MovimientoInventario movimiento = MovimientoInventario.builder()
                    .producto(producto)
                    .tipoMovimiento(MovimientoInventario.TipoMovimiento.ENTRADA)
                    .cantidad(detalle.getCantidad())
                    .motivo("Anulación de venta #" + venta.getNumeroVenta() + ". " + motivo)
                    .usuario(usuario)
                    .venta(venta)
                    .build();
            movimientoInventarioRepository.save(movimiento);
        }

        venta.setEstado(Venta.Estado.ANULADA);
        venta = ventaRepository.save(venta);

        return ApiResponse.ok(toDto(venta));
    }

    private VentaDTO toDto(Venta venta) {
        VentaDTO dto = new VentaDTO();
        dto.setId(venta.getId());
        dto.setNumeroVenta(venta.getNumeroVenta());
        dto.setFecha(venta.getFecha());
        dto.setUsuario(toUsuarioDto(venta.getUsuario()));
        if (venta.getCliente() != null) {
            dto.setCliente(toClienteDto(venta.getCliente()));
        }
        dto.setSubtotal(venta.getSubtotal());
        dto.setDescuento(venta.getDescuento());
        dto.setImpuesto(venta.getImpuesto());
        dto.setTotal(venta.getTotal());
        dto.setFormaPago(venta.getFormaPago().name());
        dto.setEstado(venta.getEstado().name());
        dto.setObservaciones(venta.getObservaciones());
        dto.setFechaCreacion(venta.getFechaCreacion());
        
        if (venta.getDetalles() != null) {
            dto.setDetalles(venta.getDetalles().stream()
                    .map(this::toDetalleDto)
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    private DetalleVentaDTO toDetalleDto(DetalleVenta detalle) {
        DetalleVentaDTO dto = new DetalleVentaDTO();
        dto.setId(detalle.getId());
        dto.setProducto(toProductoDto(detalle.getProducto()));
        dto.setCantidad(detalle.getCantidad());
        dto.setPrecioUnitario(detalle.getPrecioUnitario());
        dto.setDescuento(detalle.getDescuento());
        dto.setSubtotal(detalle.getSubtotal());
        return dto;
    }

    private ProductoDTO toProductoDto(Producto producto) {
        ProductoDTO dto = new ProductoDTO();
        dto.setId(producto.getId());
        dto.setCodigoBarras(producto.getCodigoBarras());
        dto.setNombre(producto.getNombre());
        dto.setMarca(producto.getMarca());
        dto.setPrecioCompra(producto.getPrecioCompra());
        dto.setPrecioVenta(producto.getPrecioVenta());
        dto.setStockActual(producto.getStockActual());
        dto.setStockMinimo(producto.getStockMinimo());
        dto.setStockMaximo(producto.getStockMaximo());
        dto.setFechaVencimiento(producto.getFechaVencimiento());
        dto.setImagen(producto.getImagen());
        dto.setActivo(producto.getActivo());
        if (producto.getCategoria() != null) {
            dto.setCategoriaId(producto.getCategoria().getId());
        }
        return dto;
    }

    private UsuarioDTO toUsuarioDto(Usuario usuario) {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(usuario.getId());
        dto.setUsername(usuario.getUsername());
        dto.setEmail(usuario.getEmail());
        dto.setNombre(usuario.getNombre());
        dto.setRol(usuario.getRol().name());
        return dto;
    }

    private ClienteDTO toClienteDto(Cliente cliente) {
        ClienteDTO dto = new ClienteDTO();
        dto.setId(cliente.getId());
        dto.setTipoDocumento(cliente.getTipoDocumento().name());
        dto.setNumeroDocumento(cliente.getNumeroDocumento());
        dto.setNombre(cliente.getNombre());
        dto.setTelefono(cliente.getTelefono());
        dto.setEmail(cliente.getEmail());
        return dto;
    }
}
