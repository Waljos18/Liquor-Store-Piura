package com.licoreria.controller;

import com.licoreria.dto.ApiResponse;
import com.licoreria.dto.ProveedorDTO;
import com.licoreria.service.ProveedorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/proveedores")
@RequiredArgsConstructor
@Tag(name = "Proveedores", description = "API para gestión de proveedores")
public class ProveedorController {

    private final ProveedorService proveedorService;

    @GetMapping
    @Operation(summary = "Listar proveedores", description = "Lista proveedores con búsqueda opcional")
    public ResponseEntity<ApiResponse<Page<ProveedorDTO>>> listar(
            @RequestParam(required = false) String search,
            Pageable pageable
    ) {
        return ResponseEntity.ok(proveedorService.listar(search, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener proveedor por ID", description = "Obtiene los detalles de un proveedor")
    public ResponseEntity<ApiResponse<ProveedorDTO>> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(proveedorService.obtenerPorId(id));
    }

    @PostMapping
    @Operation(summary = "Crear proveedor", description = "Crea un nuevo proveedor")
    public ResponseEntity<ApiResponse<ProveedorDTO>> crear(@Valid @RequestBody ProveedorDTO dto) {
        return ResponseEntity.ok(proveedorService.crear(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar proveedor", description = "Actualiza los datos de un proveedor")
    public ResponseEntity<ApiResponse<ProveedorDTO>> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody ProveedorDTO dto
    ) {
        return ResponseEntity.ok(proveedorService.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar proveedor", description = "Elimina un proveedor (solo si no tiene compras asociadas)")
    public ResponseEntity<ApiResponse<Void>> eliminar(@PathVariable Long id) {
        return ResponseEntity.ok(proveedorService.eliminar(id));
    }
}
