package com.licoreria.service;

import com.licoreria.dto.ApiResponse;
import com.licoreria.dto.CategoriaDTO;
import com.licoreria.entity.Categoria;
import com.licoreria.repository.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public ApiResponse<List<CategoriaDTO>> listar(boolean soloActivas) {
        List<Categoria> list = soloActivas
                ? categoriaRepository.findByActivaTrue()
                : categoriaRepository.findAll();
        List<CategoriaDTO> dtos = list.stream().map(this::toDto).collect(Collectors.toList());
        return ApiResponse.ok(dtos);
    }

    public ApiResponse<CategoriaDTO> obtenerPorId(Long id) {
        return categoriaRepository.findById(id)
                .map(c -> ApiResponse.ok(toDto(c)))
                .orElse(ApiResponse.error("NOT_FOUND", "Categoría no encontrada"));
    }

    @Transactional
    public ApiResponse<CategoriaDTO> crear(CategoriaDTO dto) {
        if (categoriaRepository.existsByNombre(dto.getNombre())) {
            return ApiResponse.error("CONFLICT", "Ya existe una categoría con ese nombre");
        }
        Categoria c = Categoria.builder()
                .nombre(dto.getNombre())
                .descripcion(dto.getDescripcion())
                .activa(dto.getActiva() != null ? dto.getActiva() : true)
                .build();
        c = categoriaRepository.save(c);
        return ApiResponse.ok(toDto(c), "Categoría creada exitosamente");
    }

    @Transactional
    public ApiResponse<CategoriaDTO> actualizar(Long id, CategoriaDTO dto) {
        Categoria c = categoriaRepository.findById(id).orElse(null);
        if (c == null) {
            return ApiResponse.error("NOT_FOUND", "Categoría no encontrada");
        }
        if (dto.getNombre() != null && !dto.getNombre().equals(c.getNombre()) && categoriaRepository.existsByNombre(dto.getNombre())) {
            return ApiResponse.error("CONFLICT", "Ya existe una categoría con ese nombre");
        }
        if (dto.getNombre() != null) c.setNombre(dto.getNombre());
        if (dto.getDescripcion() != null) c.setDescripcion(dto.getDescripcion());
        if (dto.getActiva() != null) c.setActiva(dto.getActiva());
        c = categoriaRepository.save(c);
        return ApiResponse.ok(toDto(c), "Categoría actualizada exitosamente");
    }

    @Transactional
    public ApiResponse<Void> eliminar(Long id) {
        if (!categoriaRepository.existsById(id)) {
            return ApiResponse.error("NOT_FOUND", "Categoría no encontrada");
        }
        categoriaRepository.deleteById(id);
        return ApiResponse.ok(null, "Categoría eliminada exitosamente");
    }

    private CategoriaDTO toDto(Categoria c) {
        CategoriaDTO d = new CategoriaDTO();
        d.setId(c.getId());
        d.setNombre(c.getNombre());
        d.setDescripcion(c.getDescripcion());
        d.setActiva(c.getActiva());
        return d;
    }
}
