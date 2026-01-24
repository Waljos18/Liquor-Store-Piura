package com.licoreria.service;

import com.licoreria.dto.ApiResponse;
import com.licoreria.dto.compra.CompraDTO;
import com.licoreria.dto.compra.CrearCompraRequest;
import com.licoreria.dto.compra.DetalleCompraDTO;
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
import java.time.Instant;
import java.time.LocalDate;
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

        // Crear compra
        Compra compra = Compra.builder()
                .numeroCompra(numeroCompra)
                .proveedor(proveedor)
                .fechaCompra(request.getFechaCompra() != null ? request.getFechaCompra() : LocalDate.now())
                .total(total)
                .usuario(usuario)
                .estado(Compra.Estado.COMPLETADA)
                .observaciones(request.getObservaciones())
                .build();

        // Asignar compra a detalles
        detalles.forEach(d -> d.setCompra(compra));
        compra.setDetalles(detalles);

        // Guardar compra
        compra = compraRepository.save(compra);

        // Actualizar stock y precios, crear movimientos de inventario
        for (DetalleCompra detalle : detalles) {
            Producto producto = detalle.getProducto();
            
            // Actualizar stock
            int stockAnterior = producto.getStockActual();
            producto.setStockActual(stockAnterior + detalle.getCantidad());
            
            // Actualizar precio de compra (opcional, se puede configurar)
            producto.setPrecioCompra(detalle.getPrecioUnitario());
            
            productoRepository.save(producto);

            // Crear movimiento de inventario
            MovimientoInventario movimiento = MovimientoInventario.builder()
                    .producto(producto)
                    .tipoMovimiento(MovimientoInventario.TipoMovimiento.ENTRADA)
                    .cantidad(detalle.getCantidad())
                    .motivo("Compra #" + numeroCompra + " de " + proveedor.getRazonSocial())
                    .usuario(usuario)
                    .compra(compra)
                    .build();
            movimientoInventarioRepository.save(movimiento);
        }

        return ApiResponse.ok(toDto(compra));
    }

    private String generarNumeroCompra() {
        String fecha = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        long count = compraRepository.count();
        return "C-" + fecha + "-" + String.format("%05d", count + 1);
    }

    public ApiResponse<Page<CompraDTO>> listar(
            Long proveedorId,
            LocalDate fechaDesde,
            LocalDate fechaHasta,
            String estado,
            Pageable pageable
    ) {
        Page<Compra> page;

        if (proveedorId != null) {
            page = compraRepository.findByProveedorId(proveedorId, pageable);
        } else if (fechaDesde != null && fechaHasta != null) {
            page = compraRepository.findByFechaCompraBetween(fechaDesde, fechaHasta, pageable);
        } else if (estado != null) {
            page = compraRepository.findByEstado(Compra.Estado.valueOf(estado), pageable);
        } else {
            page = compraRepository.findAll(pageable);
        }

        return ApiResponse.ok(page.map(this::toDto));
    }

    public ApiResponse<CompraDTO> obtenerPorId(Long id) {
        return compraRepository.findById(id)
                .map(c -> ApiResponse.ok(toDto(c)))
                .orElse(ApiResponse.error("NOT_FOUND", "Compra no encontrada"));
    }

    @Transactional
    public ApiResponse<CompraDTO> anular(Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Solo ADMIN puede anular
        if (!usuario.getRol().equals("ADMIN")) {
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
        dto.setFechaCompra(compra.getFechaCompra());
        dto.setTotal(compra.getTotal());
        dto.setUsuario(toUsuarioDto(compra.getUsuario()));
        dto.setEstado(compra.getEstado().name());
        dto.setObservaciones(compra.getObservaciones());
        dto.setFechaCreacion(compra.getFechaCreacion());
        
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
        dto.setPrecioUnitario(detalle.getPrecioUnitario());
        dto.setSubtotal(detalle.getSubtotal());
        return dto;
    }

    private com.licoreria.dto.ProveedorDTO toProveedorDto(Proveedor proveedor) {
        com.licoreria.dto.ProveedorDTO dto = new com.licoreria.dto.ProveedorDTO();
        dto.setId(proveedor.getId());
        dto.setRazonSocial(proveedor.getRazonSocial());
        dto.setRuc(proveedor.getRuc());
        return dto;
    }

    private com.licoreria.dto.UsuarioDTO toUsuarioDto(Usuario usuario) {
        com.licoreria.dto.UsuarioDTO dto = new com.licoreria.dto.UsuarioDTO();
        dto.setId(usuario.getId());
        dto.setUsername(usuario.getUsername());
        dto.setNombre(usuario.getNombre());
        return dto;
    }

    private com.licoreria.dto.ProductoDTO toProductoDto(Producto producto) {
        com.licoreria.dto.ProductoDTO dto = new com.licoreria.dto.ProductoDTO();
        dto.setId(producto.getId());
        dto.setNombre(producto.getNombre());
        dto.setCodigoBarras(producto.getCodigoBarras());
        return dto;
    }
}
