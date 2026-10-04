package com.licoreria.service;

import com.licoreria.dto.ApiResponse;
import com.licoreria.dto.ProductoDTO;
import com.licoreria.dto.ProveedorDTO;
import com.licoreria.dto.UsuarioDTO;
import com.licoreria.dto.compra.CompraDTO;
import com.licoreria.dto.compra.CrearCompraRequest;
import com.licoreria.dto.compra.DetalleCompraDTO;
import com.licoreria.dto.compra.RecibirCompraRequest;
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
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CompraService {

    private final CompraRepository compraRepository;
    private final ProveedorRepository proveedorRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;
    private final MovimientoInventarioRepository movimientoInventarioRepository;

    @Transactional
    public ApiResponse<CompraDTO> crear(CrearCompraRequest request) {
        // Obtener usuario actual
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Obtener proveedor
        Proveedor proveedor = proveedorRepository.findById(request.getProveedorId())
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));

        // Validar productos y calcular total
        List<DetalleCompra> detalles = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (CrearCompraRequest.ItemCompra item : request.getItems()) {
            Producto producto = productoRepository.findById(item.getProductoId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + item.getProductoId()));

            BigDecimal subtotal = item.getPrecioUnitario()
                    .multiply(new BigDecimal(item.getCantidad()));

            DetalleCompra detalle = DetalleCompra.builder()
                    .producto(producto)
                    .cantidad(item.getCantidad())
                    .precioUnitario(item.getPrecioUnitario())
                    .subtotal(subtotal)
                    .build();

            detalles.add(detalle);
            total = total.add(subtotal);
        }

        // Generar número de compra
        String numeroCompra = generarNumeroCompra();

        // Crear compra en estado PENDIENTE (sin afectar stock aún)
        Compra compra = Compra.builder()
                .numeroCompra(numeroCompra)
                .proveedor(proveedor)
                .fechaCompra(request.getFechaCompra() != null ? request.getFechaCompra().atStartOfDay()
                        : LocalDateTime.now())
                .total(total)
                .usuario(usuario)
                .estado(Compra.Estado.PENDIENTE)
                .observaciones(request.getObservaciones())
                .build();

        // Asignar compra a detalles
        final Compra compraFinal = compra;
        detalles.forEach(d -> d.setCompra(compraFinal));
        compra.setDetalles(detalles);

        compra = compraRepository.save(compra);
        return ApiResponse.ok(toDto(compra));
    }

    private String generarNumeroCompra() {
        String fecha = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        long count = compraRepository.count();
        return "C-" + fecha + "-" + String.format("%05d", count + 1);
    }

    @Transactional(readOnly = true)
    public ApiResponse<Page<CompraDTO>> listar(
            Long proveedorId,
            LocalDate fechaDesde,
            LocalDate fechaHasta,
            String estado,
            Pageable pageable) {
        Page<Compra> page;

        if (proveedorId != null) {
            page = compraRepository.findByProveedorId(proveedorId, pageable);
        } else if (fechaDesde != null && fechaHasta != null) {
            page = compraRepository.findByFechaCompraBetween(fechaDesde.atStartOfDay(),
                    fechaHasta.atTime(LocalTime.MAX), pageable);
        } else if (estado != null) {
            page = compraRepository.findByEstado(Compra.Estado.valueOf(estado), pageable);
        } else {
            page = compraRepository.findAll(pageable);
        }

        return ApiResponse.ok(page.map(this::toDto));
    }

    @Transactional(readOnly = true)
    public ApiResponse<CompraDTO> obtenerPorId(Long id) {
        return compraRepository.findById(id)
                .map(c -> ApiResponse.ok(toDto(c)))
                .orElse(ApiResponse.error("NOT_FOUND", "Compra no encontrada"));
    }

    @Transactional
    public ApiResponse<CompraDTO> recibir(Long id, RecibirCompraRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Usuario usuario = usuarioRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Compra compra = compraRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compra no encontrada"));

        if (compra.getEstado() == Compra.Estado.ANULADA) {
            return ApiResponse.error("INVALID", "No se puede recibir una compra anulada");
        }
        if (compra.getEstado() == Compra.Estado.RECIBIDA || compra.getEstado() == Compra.Estado.COMPLETADA) {
            return ApiResponse.error("INVALID", "La compra ya fue recibida en su totalidad");
        }

        String numeroCompra = compra.getNumeroCompra();
        Proveedor proveedor = compra.getProveedor();

        // Determinar cantidades a recibir (full o parcial)
        java.util.Map<Long, Integer> cantidadesPorProducto = new java.util.HashMap<>();
        if (request != null && request.getItems() != null && !request.getItems().isEmpty()) {
            for (RecibirCompraRequest.ItemRecepcion item : request.getItems()) {
                if (item.getCantidadRecibida() != null && item.getCantidadRecibida() > 0) {
                    cantidadesPorProducto.put(item.getProductoId(), item.getCantidadRecibida());
                }
            }
        }

        boolean todasRecibidas = true;
        for (DetalleCompra detalle : compra.getDetalles()) {
            Producto producto = detalle.getProducto();
            int yaRecibido = detalle.getCantidadRecibida() != null ? detalle.getCantidadRecibida() : 0;
            int pendiente = detalle.getCantidad() - yaRecibido;

            int aRecibir;
            if (cantidadesPorProducto.isEmpty()) {
                aRecibir = pendiente; // recibir todo lo pendiente
            } else {
                aRecibir = cantidadesPorProducto.getOrDefault(producto.getId(), 0);
                aRecibir = Math.min(aRecibir, pendiente);
            }

            if (aRecibir <= 0) {
                if (pendiente > 0) todasRecibidas = false;
                continue;
            }

            detalle.setCantidadRecibida(yaRecibido + aRecibir);
            if (detalle.getCantidadRecibida() < detalle.getCantidad()) todasRecibidas = false;

            // Actualizar stock y precio compra
            producto.setStockActual(producto.getStockActual() + aRecibir);
            producto.setPrecioCompra(detalle.getPrecioUnitario());
            productoRepository.save(producto);

            MovimientoInventario movimiento = MovimientoInventario.builder()
                    .producto(producto)
                    .tipoMovimiento(MovimientoInventario.TipoMovimiento.ENTRADA)
                    .cantidad(aRecibir)
                    .motivo("Recepción compra #" + numeroCompra + " de " + proveedor.getRazonSocial())
                    .usuario(usuario)
                    .compra(compra)
                    .build();
            movimientoInventarioRepository.save(movimiento);
        }

        compra.setEstado(todasRecibidas ? Compra.Estado.RECIBIDA : Compra.Estado.PENDIENTE);
        if (todasRecibidas) compra.setFechaRecepcion(java.time.Instant.now());
        compra = compraRepository.save(compra);
        return ApiResponse.ok(toDto(compra));
    }

    @Transactional
    public ApiResponse<CompraDTO> anular(Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Solo ADMIN puede anular
        if (usuario.getRol() != Usuario.Rol.ADMIN) {
            return ApiResponse.error("FORBIDDEN", "Solo administradores pueden anular compras");
        }

        Compra compra = compraRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compra no encontrada"));

        if (compra.getEstado() == Compra.Estado.ANULADA) {
            return ApiResponse.error("INVALID", "La compra ya está anulada");
        }

        // Restaurar stock
        for (DetalleCompra detalle : compra.getDetalles()) {
            Producto producto = detalle.getProducto();
            int stockActual = producto.getStockActual();
            if (stockActual < detalle.getCantidad()) {
                return ApiResponse.error("INVALID",
                        "No se puede anular la compra. El stock actual de " + producto.getNombre() +
                                " es menor que la cantidad comprada.");
            }

            producto.setStockActual(stockActual - detalle.getCantidad());
            productoRepository.save(producto);

            // Crear movimiento de inventario
            MovimientoInventario movimiento = MovimientoInventario.builder()
                    .producto(producto)
                    .tipoMovimiento(MovimientoInventario.TipoMovimiento.SALIDA)
                    .cantidad(detalle.getCantidad())
                    .motivo("Anulación de compra #" + compra.getNumeroCompra())
                    .usuario(usuario)
                    .compra(compra)
                    .build();
            movimientoInventarioRepository.save(movimiento);
        }

        compra.setEstado(Compra.Estado.ANULADA);
        compra = compraRepository.save(compra);

        return ApiResponse.ok(toDto(compra));
    }

    private CompraDTO toDto(Compra compra) {
        CompraDTO dto = new CompraDTO();
        dto.setId(compra.getId());
        dto.setNumeroCompra(compra.getNumeroCompra());
        dto.setProveedor(toProveedorDto(compra.getProveedor()));
        dto.setFechaCompra(compra.getFechaCompra() != null ? compra.getFechaCompra().toLocalDate() : null);
        dto.setTotal(compra.getTotal());
        dto.setUsuario(toUsuarioDto(compra.getUsuario()));
        dto.setEstado(compra.getEstado().name());
        dto.setObservaciones(compra.getObservaciones());
        dto.setFechaCreacion(compra.getFechaCreacion());
        dto.setFechaRecepcion(compra.getFechaRecepcion());

        if (compra.getDetalles() != null) {
            dto.setDetalles(compra.getDetalles().stream()
                    .map(this::toDetalleDto)
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    private DetalleCompraDTO toDetalleDto(DetalleCompra detalle) {
        DetalleCompraDTO dto = new DetalleCompraDTO();
        dto.setId(detalle.getId());
        dto.setProducto(toProductoDto(detalle.getProducto()));
        dto.setCantidad(detalle.getCantidad());
        dto.setCantidadRecibida(detalle.getCantidadRecibida() != null ? detalle.getCantidadRecibida() : 0);
        dto.setPrecioUnitario(detalle.getPrecioUnitario());
        dto.setSubtotal(detalle.getSubtotal());
        return dto;
    }

    private ProveedorDTO toProveedorDto(Proveedor proveedor) {
        ProveedorDTO dto = new ProveedorDTO();
        dto.setId(proveedor.getId());
        dto.setRazonSocial(proveedor.getRazonSocial());
        dto.setRuc(proveedor.getRuc());
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

    private ProductoDTO toProductoDto(Producto producto) {
        ProductoDTO dto = new ProductoDTO();
        dto.setId(producto.getId());
        dto.setNombre(producto.getNombre());
        dto.setCodigoBarras(producto.getCodigoBarras());
        return dto;
    }
}
