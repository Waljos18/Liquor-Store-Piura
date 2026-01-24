package com.licoreria.controller;

import com.licoreria.dto.ApiResponse;
import com.licoreria.dto.venta.CrearVentaRequest;
import com.licoreria.dto.venta.VentaDTO;
import com.licoreria.service.VentaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequestMapping("/api/v1/ventas")
@RequiredArgsConstructor
@Tag(name = "Ventas", description = "API para gestión de ventas")
public class VentaController {

    private final VentaService ventaService;

    @PostMapping
    @Operation(summary = "Crear nueva venta", description = "Crea una nueva venta con validación de stock y aplicación de promociones")
    public ResponseEntity<ApiResponse<VentaDTO>> crear(@Valid @RequestBody CrearVentaRequest request) {
        return ResponseEntity.ok(ventaService.crear(request));
    }

    @GetMapping
    @Operation(summary = "Listar ventas", description = "Lista ventas con filtros opcionales")
    public ResponseEntity<ApiResponse<Page<VentaDTO>>> listar(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant fechaDesde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant fechaHasta,
            @RequestParam(required = false) Long usuarioId,
            @RequestParam(required = false) Long clienteId,
            @RequestParam(required = false) String estado,
            Pageable pageable
    ) {
        return ResponseEntity.ok(ventaService.listar(fechaDesde, fechaHasta, usuarioId, clienteId, estado, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener venta por ID", description = "Obtiene los detalles completos de una venta")
    public ResponseEntity<ApiResponse<VentaDTO>> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(ventaService.obtenerPorId(id));
    }

    @PutMapping("/{id}/anular")
    @Operation(summary = "Anular venta", description = "Anula una venta (solo ADMIN). Restaura el stock de productos.")
    public ResponseEntity<ApiResponse<VentaDTO>> anular(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "Anulación por administrador") String motivo
    ) {
        return ResponseEntity.ok(ventaService.anular(id, motivo));
    }
}
