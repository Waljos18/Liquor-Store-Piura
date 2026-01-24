package com.licoreria.service;

import com.licoreria.dto.ApiResponse;
import com.licoreria.dto.ProveedorDTO;
import com.licoreria.entity.Proveedor;
import com.licoreria.repository.ProveedorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProveedorService {

    private final ProveedorRepository proveedorRepository;

    public ApiResponse<Page<ProveedorDTO>> listar(String search, Pageable pageable) {
        Page<Proveedor> page;
        if (search != null && !search.isBlank()) {
            page = proveedorRepository.buscar(search.trim(), pageable);
        } else {
            page = proveedorRepository.findByActivoTrue(pageable);
        }
        return ApiResponse.ok(page.map(this::toDto));
    }

    public ApiResponse<ProveedorDTO> obtenerPorId(Long id) {
        return proveedorRepository.findById(id)
                .map(p -> ApiResponse.ok(toDto(p)))
                .orElse(ApiResponse.error("NOT_FOUND", "Proveedor no encontrado"));
    }

    @Transactional
    public ApiResponse<ProveedorDTO> crear(ProveedorDTO dto) {
        if (dto.getRuc() != null && !dto.getRuc().isBlank() && proveedorRepository.findByRuc(dto.getRuc()).isPresent()) {
            return ApiResponse.error("CONFLICT", "Ya existe un proveedor con ese RUC");
        }

        Proveedor proveedor = Proveedor.builder()
                .razonSocial(dto.getRazonSocial())
                .ruc(dto.getRuc())
                .direccion(dto.getDireccion())
                .telefono(dto.getTelefono())
                .email(dto.getEmail())
                .activo(true)
                .build();

        proveedor = proveedorRepository.save(proveedor);
        return ApiResponse.ok(toDto(proveedor), "Proveedor creado exitosamente");
    }

    @Transactional
    public ApiResponse<ProveedorDTO> actualizar(Long id, ProveedorDTO dto) {
        Proveedor proveedor = proveedorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));

        if (dto.getRuc() != null && !dto.getRuc().equals(proveedor.getRuc()) 
                && proveedorRepository.findByRuc(dto.getRuc()).isPresent()) {
            return ApiResponse.error("CONFLICT", "Ya existe un proveedor con ese RUC");
        }

        if (dto.getRazonSocial() != null) proveedor.setRazonSocial(dto.getRazonSocial());
        if (dto.getRuc() != null) proveedor.setRuc(dto.getRuc());
        if (dto.getDireccion() != null) proveedor.setDireccion(dto.getDireccion());
        if (dto.getTelefono() != null) proveedor.setTelefono(dto.getTelefono());
        if (dto.getEmail() != null) proveedor.setEmail(dto.getEmail());
        if (dto.getActivo() != null) proveedor.setActivo(dto.getActivo());

        proveedor = proveedorRepository.save(proveedor);
        return ApiResponse.ok(toDto(proveedor), "Proveedor actualizado exitosamente");
    }

    @Transactional
    public ApiResponse<Void> eliminar(Long id) {
        Proveedor proveedor = proveedorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));

        // Verificar si tiene compras asociadas
        if (!proveedor.getCompras().isEmpty()) {
            return ApiResponse.error("CONFLICT", 
                "No se puede eliminar el proveedor porque tiene compras asociadas. Desactívelo en su lugar.");
        }

        proveedorRepository.delete(proveedor);
        return ApiResponse.ok(null, "Proveedor eliminado exitosamente");
    }

    private ProveedorDTO toDto(Proveedor proveedor) {
        ProveedorDTO dto = new ProveedorDTO();
        dto.setId(proveedor.getId());
        dto.setRazonSocial(proveedor.getRazonSocial());
        dto.setRuc(proveedor.getRuc());
        dto.setDireccion(proveedor.getDireccion());
        dto.setTelefono(proveedor.getTelefono());
        dto.setEmail(proveedor.getEmail());
        dto.setActivo(proveedor.getActivo());
        dto.setFechaCreacion(proveedor.getFechaCreacion());
        return dto;
    }
}
