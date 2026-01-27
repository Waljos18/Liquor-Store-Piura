package com.licoreria.controller;

import com.licoreria.dto.ApiResponse;
import com.licoreria.dto.promocion.CrearPromocionRequest;
import com.licoreria.dto.promocion.PromocionDTO;
import com.licoreria.service.PromocionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/promociones")
@RequiredArgsConstructor
@Tag(name = "Promociones", description = "API para gestión de promociones")
public class PromocionController {

    private final PromocionService promocionService;

    @GetMapping
    @Operation(summary = "Listar promociones", description = "Lista promociones con filtro opcional de solo activas")
    public ResponseEntity<ApiResponse<Page<PromocionDTO>>> listar(
            @RequestParam(required = false) Boolean soloActivas,
            Pageable pageable
    ) {
        return ResponseEntity.ok(promocionService.listar(soloActivas, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener promoción por ID", description = "Obtiene los detalles completos de una promoción")
    public ResponseEntity<ApiResponse<PromocionDTO>> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(promocionService.obtenerPorId(id));
    }

    @GetMapping("/productos/{productoId}")
    @Operation(summary = "Promociones activas por producto", description = "Obtiene las promociones activas para un producto específico")
    public ResponseEntity<ApiResponse<List<PromocionDTO>>> obtenerPromocionesPorProducto(
            @PathVariable Long productoId
    ) {
        return ResponseEntity.ok(promocionService.obtenerPromocionesActivasPorProducto(productoId));
    }

    @PostMapping
    @Operation(summary = "Crear promoción", description = "Crea una nueva promoción con productos asociados")
    public ResponseEntity<ApiResponse<PromocionDTO>> crear(@Valid @RequestBody CrearPromocionRequest request) {
        return ResponseEntity.ok(promocionService.crear(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar promoción", description = "Actualiza los datos de una promoción")
    public ResponseEntity<ApiResponse<PromocionDTO>> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody CrearPromocionRequest request
    ) {
        return ResponseEntity.ok(promocionService.actualizar(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Desactivar promoción", description = "Desactiva una promoción (eliminación lógica)")
    public ResponseEntity<ApiResponse<Void>> desactivar(@PathVariable Long id) {
        return ResponseEntity.ok(promocionService.desactivar(id));
    }

    @PostMapping("/{id}/aplicar")
    @Operation(summary = "Validar aplicación de promoción", description = "Valida si una promoción puede aplicarse a un producto con cierta cantidad")
    public ResponseEntity<ApiResponse<PromocionDTO>> aplicarPromocion(
            @PathVariable Long id,
            @RequestParam Long productoId,
            @RequestParam Integer cantidad
    ) {
        return ResponseEntity.ok(promocionService.aplicarPromocion(id, productoId, cantidad));
    }
}
