package com.licoreria.service;

import com.licoreria.dto.ApiResponse;
import com.licoreria.dto.gasto.CrearGastoRequest;
import com.licoreria.dto.gasto.GastoDTO;
import com.licoreria.entity.Gasto;
import com.licoreria.entity.Usuario;
import com.licoreria.repository.GastoRepository;
import com.licoreria.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class GastoService {

    private final GastoRepository gastoRepository;
    private final UsuarioRepository usuarioRepository;

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter DATETIME_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Transactional(readOnly = true)
    public ApiResponse<Page<GastoDTO>> listar(LocalDate desde, LocalDate hasta, int page, int size) {
        if (desde == null || hasta == null) {
            LocalDate hoy = LocalDate.now();
            desde = hoy.withDayOfMonth(1);
            hasta = hoy.withDayOfMonth(hoy.lengthOfMonth());
        }
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "fecha"));
        Page<Gasto> gastos = gastoRepository.findByFechaBetween(desde, hasta, pageable);
        return ApiResponse.ok(gastos.map(this::toDto));
    }

    @Transactional
    public ApiResponse<GastoDTO> crear(CrearGastoRequest request, Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Gasto.Categoria categoria;
        try {
            categoria = Gasto.Categoria.valueOf(request.getCategoria().toUpperCase());
        } catch (IllegalArgumentException e) {
            return ApiResponse.error("INVALID", "Categoría inválida: " + request.getCategoria());
        }

        Gasto gasto = Gasto.builder()
                .descripcion(request.getDescripcion())
                .categoria(categoria)
                .monto(request.getMonto())
                .fecha(request.getFecha())
                .comprobante(request.getComprobante())
                .observaciones(request.getObservaciones())
                .usuario(usuario)
                .build();

        gasto = gastoRepository.save(gasto);
        return ApiResponse.ok(toDto(gasto));
    }

    @Transactional
    public ApiResponse<Void> eliminar(Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean esAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!esAdmin) {
            return ApiResponse.error("FORBIDDEN", "Solo ADMIN puede eliminar gastos");
        }

        if (!gastoRepository.existsById(id)) {
            return ApiResponse.error("NOT_FOUND", "Gasto no encontrado con id: " + id);
        }

        gastoRepository.deleteById(id);
        return ApiResponse.ok(null, "Gasto eliminado correctamente");
    }

    private GastoDTO toDto(Gasto g) {
        GastoDTO dto = new GastoDTO();
        dto.setId(g.getId());
        dto.setDescripcion(g.getDescripcion());
        dto.setCategoria(g.getCategoria().name());
        dto.setMonto(g.getMonto());
        dto.setFecha(g.getFecha() != null ? g.getFecha().format(DATE_FMT) : null);
        dto.setComprobante(g.getComprobante());
        dto.setObservaciones(g.getObservaciones());
        dto.setUsuario(g.getUsuario() != null ? g.getUsuario().getNombre() : null);
        dto.setFechaCreacion(g.getFechaCreacion() != null
                ? g.getFechaCreacion().atZone(ZoneId.systemDefault()).format(DATETIME_FMT)
                : null);
        return dto;
    }
}
