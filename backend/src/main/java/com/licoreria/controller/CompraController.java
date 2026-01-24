package com.licoreria.controller;

import com.licoreria.dto.ApiResponse;
import com.licoreria.dto.compra.CompraDTO;
import com.licoreria.dto.compra.CrearCompraRequest;
import com.licoreria.service.CompraService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/compras")
@RequiredArgsConstructor
@Tag(name = "Compras", description = "API para gestión de compras")
public class CompraController {

    private final CompraService compraService;

    @PostMapping
    @Operation(summary = "Registrar compra", description = "Registra una nueva compra y actualiza el inventario")
    public ResponseEntity<ApiResponse<CompraDTO>> crear(@Valid @RequestBody CrearCompraRequest request) {
        return ResponseEntity.ok(compraService.crear(request));
    }

    @GetMapping
    @Operation(summary = "Listar compras", description = "Lista compras con filtros opcionales")
    public ResponseEntity<ApiResponse<Page<CompraDTO>>> listar(
            @RequestParam(required = false) Long proveedorId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaDesde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaHasta,
            @RequestParam(required = false) String estado,
            Pageable pageable
    ) {
        return ResponseEntity.ok(compraService.listar(proveedorId, fechaDesde, fechaHasta, estado, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener compra por ID", description = "Obtiene los detalles completos de una compra")
    public ResponseEntity<ApiResponse<CompraDTO>> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(compraService.obtenerPorId(id));
    }

    @PutMapping("/{id}/anular")
    @Operation(summary = "Anular compra", description = "Anula una compra (solo ADMIN). Restaura el stock de productos.")
    public ResponseEntity<ApiResponse<CompraDTO>> anular(@PathVariable Long id) {
        return ResponseEntity.ok(compraService.anular(id));
    }
}
