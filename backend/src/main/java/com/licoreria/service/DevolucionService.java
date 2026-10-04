package com.licoreria.service;

import com.licoreria.dto.ApiResponse;
import com.licoreria.dto.UsuarioDTO;
import com.licoreria.dto.devolucion.CrearDevolucionRequest;
import com.licoreria.dto.devolucion.DetalleDevolucionDTO;
import com.licoreria.dto.devolucion.DevolucionDTO;
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
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DevolucionService {

    private final DevolucionRepository devolucionRepository;
    private final VentaRepository ventaRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;
    private final MovimientoInventarioRepository movimientoInventarioRepository;

    @Transactional
    public ApiResponse<DevolucionDTO> crear(CrearDevolucionRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Usuario usuario = usuarioRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Venta venta = null;
        if (request.getVentaId() != null) {
            venta = ventaRepository.findByIdWithDetalles(request.getVentaId())
                    .orElseThrow(() -> new RuntimeException("Venta no encontrada"));
            if (venta.getEstado() == Venta.Estado.ANULADA) {
                return ApiResponse.error("INVALID", "No se puede devolver una venta anulada");
            }
        }

        DevolucionVenta.Motivo motivo;
        try {
            motivo = DevolucionVenta.Motivo.valueOf(request.getMotivo().toUpperCase());
        } catch (IllegalArgumentException e) {
            return ApiResponse.error("INVALID", "Motivo inválido: " + request.getMotivo());
        }

        List<DetalleDevolucion> detalles = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (CrearDevolucionRequest.ItemDevolucion item : request.getItems()) {
            Producto producto = productoRepository.findById(item.getProductoId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + item.getProductoId()));

            BigDecimal subtotal = item.getPrecioUnitario().multiply(BigDecimal.valueOf(item.getCantidad()));
            DetalleDevolucion detalle = DetalleDevolucion.builder()
                    .producto(producto)
                    .cantidad(item.getCantidad())
                    .precioUnitario(item.getPrecioUnitario())
                    .subtotal(subtotal)
                    .build();
            detalles.add(detalle);
            total = total.add(subtotal);
        }

        String numero = generarNumero();
        DevolucionVenta devolucion = DevolucionVenta.builder()
                .numeroDevolucion(numero)
                .venta(venta)
                .usuario(usuario)
                .motivo(motivo)
                .estado(DevolucionVenta.Estado.COMPLETADA)
                .observaciones(request.getObservaciones())
                .total(total)
                .build();

        final DevolucionVenta devFinal = devolucion;
        detalles.forEach(d -> d.setDevolucion(devFinal));
        devolucion.setDetalles(detalles);
        devolucion = devolucionRepository.save(devolucion);

        // Restaurar stock
        for (DetalleDevolucion detalle : detalles) {
            Producto producto = detalle.getProducto();
            producto.setStockActual(producto.getStockActual() + detalle.getCantidad());
            productoRepository.save(producto);

            MovimientoInventario mov = MovimientoInventario.builder()
                    .producto(producto)
                    .tipoMovimiento(MovimientoInventario.TipoMovimiento.ENTRADA)
                    .cantidad(detalle.getCantidad())
                    .motivo("Devolución #" + numero + " - " + motivo.name())
                    .usuario(usuario)
                    .build();
            movimientoInventarioRepository.save(mov);
        }

        return ApiResponse.ok(toDto(devolucion));
    }

    @Transactional(readOnly = true)
    public ApiResponse<Page<DevolucionDTO>> listar(Instant desde, Instant hasta, Pageable pageable) {
        Page<DevolucionVenta> page;
        if (desde != null && hasta != null) {
            page = devolucionRepository.findByFechaBetween(desde, hasta, pageable);
        } else {
            page = devolucionRepository.findAll(pageable);
        }
        return ApiResponse.ok(page.map(this::toDto));
    }

    @Transactional(readOnly = true)
    public ApiResponse<DevolucionDTO> obtenerPorId(Long id) {
        return devolucionRepository.findById(id)
                .map(d -> ApiResponse.ok(toDto(d)))
                .orElse(ApiResponse.error("NOT_FOUND", "Devolución no encontrada"));
    }

    @Transactional(readOnly = true)
    public ApiResponse<List<DevolucionDTO>> porVenta(Long ventaId) {
        List<DevolucionVenta> list = devolucionRepository.findByVentaId(ventaId);
        return ApiResponse.ok(list.stream().map(this::toDto).collect(Collectors.toList()));
    }

    private String generarNumero() {
        String fecha = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        long count = devolucionRepository.count();
        return "D-" + fecha + "-" + String.format("%05d", count + 1);
    }

    private DevolucionDTO toDto(DevolucionVenta d) {
        DevolucionDTO dto = new DevolucionDTO();
        dto.setId(d.getId());
        dto.setNumeroDevolucion(d.getNumeroDevolucion());
        if (d.getVenta() != null) {
            dto.setVentaId(d.getVenta().getId());
            dto.setNumeroVenta(d.getVenta().getNumeroVenta());
        }
        dto.setFecha(d.getFecha());
        dto.setMotivo(d.getMotivo().name());
        dto.setEstado(d.getEstado().name());
        dto.setObservaciones(d.getObservaciones());
        dto.setTotal(d.getTotal());
        dto.setFechaCreacion(d.getFechaCreacion());

        UsuarioDTO uDto = new UsuarioDTO();
        uDto.setId(d.getUsuario().getId());
        uDto.setNombre(d.getUsuario().getNombre());
        uDto.setUsername(d.getUsuario().getUsername());
        uDto.setRol(d.getUsuario().getRol().name());
        dto.setUsuario(uDto);

        if (d.getDetalles() != null) {
            dto.setDetalles(d.getDetalles().stream().map(det -> {
                DetalleDevolucionDTO dd = new DetalleDevolucionDTO();
                dd.setId(det.getId());
                dd.setProductoId(det.getProducto().getId());
                dd.setProductoNombre(det.getProducto().getNombre());
                dd.setCantidad(det.getCantidad());
                dd.setPrecioUnitario(det.getPrecioUnitario());
                dd.setSubtotal(det.getSubtotal());
                return dd;
            }).collect(Collectors.toList()));
        }
        return dto;
    }
}
