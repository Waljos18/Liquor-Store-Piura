package com.licoreria.service;

import com.licoreria.dto.ApiResponse;
import com.licoreria.dto.merma.MermaDTO;
import com.licoreria.dto.merma.RegistrarMermaRequest;
import com.licoreria.entity.Merma;
import com.licoreria.entity.MovimientoInventario;
import com.licoreria.entity.Producto;
import com.licoreria.entity.Usuario;
import com.licoreria.repository.MermaRepository;
import com.licoreria.repository.MovimientoInventarioRepository;
import com.licoreria.repository.ProductoRepository;
import com.licoreria.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class MermaService {

    private final MermaRepository mermaRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;
    private final MovimientoInventarioRepository movimientoInventarioRepository;

    private static final DateTimeFormatter DATETIME_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Transactional
    public ApiResponse<MermaDTO> registrar(RegistrarMermaRequest request, Long usuarioId) {
        Producto producto = productoRepository.findById(request.getProductoId())
                .orElse(null);
        if (producto == null) {
            return ApiResponse.error("NOT_FOUND", "Producto no encontrado con id: " + request.getProductoId());
        }

        if (producto.getStockActual() < request.getCantidad()) {
            return ApiResponse.error("INVALID",
                    "Stock insuficiente. Stock actual: " + producto.getStockActual()
                            + ", cantidad solicitada: " + request.getCantidad());
        }

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Merma.Motivo motivo;
        try {
            motivo = Merma.Motivo.valueOf(request.getMotivo().toUpperCase());
        } catch (IllegalArgumentException e) {
            return ApiResponse.error("INVALID", "Motivo inválido: " + request.getMotivo());
        }

        BigDecimal precioBase = producto.getPrecioCompra() != null
                ? producto.getPrecioCompra()
                : (producto.getPrecioVenta() != null ? producto.getPrecioVenta() : BigDecimal.ZERO);
        BigDecimal valorPerdida = precioBase.multiply(BigDecimal.valueOf(request.getCantidad()));

        Merma merma = Merma.builder()
                .producto(producto)
                .cantidad(request.getCantidad())
                .motivo(motivo)
                .descripcion(request.getDescripcion())
                .valorPerdida(valorPerdida)
                .usuario(usuario)
                .build();

        merma = mermaRepository.save(merma);

        // Descontar stock del producto
        producto.setStockActual(producto.getStockActual() - request.getCantidad());
        productoRepository.save(producto);

        // Registrar movimiento de inventario
        String motivoMovimiento = "MERMA: " + motivo.name()
                + (request.getDescripcion() != null ? " - " + request.getDescripcion() : "");
        MovimientoInventario movimiento = MovimientoInventario.builder()
                .producto(producto)
                .tipoMovimiento(MovimientoInventario.TipoMovimiento.SALIDA)
                .cantidad(-request.getCantidad())
                .motivo(motivoMovimiento)
                .usuario(usuario)
                .build();
        movimientoInventarioRepository.save(movimiento);

        return ApiResponse.ok(toDto(merma));
    }

    @Transactional(readOnly = true)
    public ApiResponse<Page<MermaDTO>> listar(LocalDate desde, LocalDate hasta, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "fecha"));
        Page<Merma> mermas;
        if (desde != null && hasta != null) {
            Instant desdeInstant = desde.atStartOfDay(ZoneId.systemDefault()).toInstant();
            Instant hastaInstant = hasta.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();
            mermas = mermaRepository.findByFechaBetween(desdeInstant, hastaInstant, pageable);
        } else {
            mermas = mermaRepository.findAll(pageable);
        }
        return ApiResponse.ok(mermas.map(this::toDto));
    }

    private MermaDTO toDto(Merma m) {
        MermaDTO dto = new MermaDTO();
        dto.setId(m.getId());
        dto.setProductoId(m.getProducto() != null ? m.getProducto().getId() : null);
        dto.setProductoNombre(m.getProducto() != null ? m.getProducto().getNombre() : null);
        dto.setCantidad(m.getCantidad());
        dto.setMotivo(m.getMotivo() != null ? m.getMotivo().name() : null);
        dto.setDescripcion(m.getDescripcion());
        dto.setValorPerdida(m.getValorPerdida());
        dto.setFecha(m.getFecha() != null
                ? m.getFecha().atZone(ZoneId.systemDefault()).format(DATETIME_FMT)
                : null);
        dto.setUsuario(m.getUsuario() != null ? m.getUsuario().getNombre() : null);
        return dto;
    }
}
