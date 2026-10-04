package com.licoreria.controller;

import com.licoreria.dto.ApiResponse;
import com.licoreria.dto.devolucion.CrearDevolucionRequest;
import com.licoreria.dto.devolucion.DevolucionDTO;
import com.licoreria.service.DevolucionService;
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
import java.util.List;

@RestController
@RequestMapping("/api/v1/devoluciones")
@RequiredArgsConstructor
@Tag(name = "Devoluciones", description = "API para gestión de devoluciones de ventas")
public class DevolucionController {

    private final DevolucionService devolucionService;

    @PostMapping
    @Operation(summary = "Registrar devolución", description = "Registra una devolución parcial o total de productos")
    public ResponseEntity<ApiResponse<DevolucionDTO>> crear(@Valid @RequestBody CrearDevolucionRequest request) {
        return ResponseEntity.ok(devolucionService.crear(request));
    }

    @GetMapping
    @Operation(summary = "Listar devoluciones")
    public ResponseEntity<ApiResponse<Page<DevolucionDTO>>> listar(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant desde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant hasta,
            Pageable pageable
    ) {
        return ResponseEntity.ok(devolucionService.listar(desde, hasta, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener devolución por ID")
    public ResponseEntity<ApiResponse<DevolucionDTO>> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(devolucionService.obtenerPorId(id));
    }

    @GetMapping("/por-venta/{ventaId}")
    @Operation(summary = "Devoluciones de una venta")
    public ResponseEntity<ApiResponse<List<DevolucionDTO>>> porVenta(@PathVariable Long ventaId) {
        return ResponseEntity.ok(devolucionService.porVenta(ventaId));
    }
}
