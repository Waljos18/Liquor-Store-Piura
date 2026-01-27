package com.licoreria.controller;

import com.licoreria.dto.ApiResponse;
import com.licoreria.dto.pack.CrearPackRequest;
import com.licoreria.dto.pack.PackDTO;
import com.licoreria.service.PackService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/v1/packs")
@RequiredArgsConstructor
@Tag(name = "Packs", description = "API para gestión de packs de productos")
public class PackController {

    private final PackService packService;

    @GetMapping
    @Operation(summary = "Listar packs", description = "Lista packs con filtro opcional de solo activos")
    public ResponseEntity<ApiResponse<Page<PackDTO>>> listar(
            @RequestParam(required = false) Boolean soloActivos,
            Pageable pageable
    ) {
        return ResponseEntity.ok(packService.listar(soloActivos, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener pack por ID", description = "Obtiene los detalles completos de un pack con sus productos")
    public ResponseEntity<ApiResponse<PackDTO>> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(packService.obtenerPorId(id));
    }

    @PostMapping
    @Operation(summary = "Crear pack", description = "Crea un nuevo pack con productos y precio especial")
    public ResponseEntity<ApiResponse<PackDTO>> crear(@Valid @RequestBody CrearPackRequest request) {
        return ResponseEntity.ok(packService.crear(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar pack", description = "Actualiza los datos de un pack")
    public ResponseEntity<ApiResponse<PackDTO>> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody CrearPackRequest request
    ) {
        return ResponseEntity.ok(packService.actualizar(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Desactivar pack", description = "Desactiva un pack (eliminación lógica)")
    public ResponseEntity<ApiResponse<Void>> desactivar(@PathVariable Long id) {
        return ResponseEntity.ok(packService.desactivar(id));
    }

    @GetMapping("/{id}/calcular-precio")
    @Operation(summary = "Calcular precio sugerido", description = "Calcula el precio sugerido del pack basado en los precios de los productos (10% descuento)")
    public ResponseEntity<ApiResponse<BigDecimal>> calcularPrecioSugerido(@PathVariable Long id) {
        return ResponseEntity.ok(packService.calcularPrecioSugerido(id));
    }
}
