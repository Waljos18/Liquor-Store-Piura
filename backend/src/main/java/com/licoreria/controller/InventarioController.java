package com.licoreria.controller;

import com.licoreria.dto.ApiResponse;
import com.licoreria.dto.ProductoDTO;
import com.licoreria.entity.MovimientoInventario;
import com.licoreria.service.InventarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/v1/inventario")
@RequiredArgsConstructor
@Tag(name = "Inventario", description = "API para gestión de inventario")
public class InventarioController {

    private final InventarioService inventarioService;

    @GetMapping("/movimientos")
    @Operation(summary = "Listar movimientos de inventario", description = "Lista movimientos con filtros opcionales")
    public ResponseEntity<ApiResponse<Page<MovimientoInventario>>> listarMovimientos(
            @RequestParam(required = false) Long productoId,
            @RequestParam(required = false) String tipoMovimiento,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant fechaDesde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant fechaHasta,
            Pageable pageable
    ) {
        return ResponseEntity.ok(inventarioService.listarMovimientos(
                productoId, tipoMovimiento, fechaDesde, fechaHasta, pageable));
    }

    @GetMapping("/productos/{productoId}/historial")
    @Operation(summary = "Historial de movimientos de un producto", description = "Obtiene el historial completo de movimientos de un producto")
    public ResponseEntity<ApiResponse<List<MovimientoInventario>>> obtenerHistorialProducto(
            @PathVariable Long productoId
    ) {
        return ResponseEntity.ok(inventarioService.obtenerHistorialProducto(productoId));
    }

    @PostMapping("/movimientos")
    @Operation(summary = "Crear movimiento manual", description = "Crea un movimiento manual de inventario (ENTRADA, SALIDA, AJUSTE)")
    public ResponseEntity<ApiResponse<MovimientoInventario>> crearMovimientoManual(
            @RequestParam Long productoId,
            @RequestParam String tipoMovimiento,
            @RequestParam Integer cantidad,
            @RequestParam(required = false) String motivo
    ) {
        return ResponseEntity.ok(inventarioService.crearMovimientoManual(
                productoId, tipoMovimiento, cantidad, motivo));
    }

    @GetMapping("/alertas/stock-bajo")
    @Operation(summary = "Productos con stock bajo", description = "Lista productos cuyo stock está por debajo del mínimo")
    public ResponseEntity<ApiResponse<List<ProductoDTO>>> obtenerProductosStockBajo() {
        return ResponseEntity.ok(inventarioService.obtenerProductosStockBajo());
    }

    @GetMapping("/alertas/vencimiento")
    @Operation(summary = "Productos próximos a vencer", description = "Lista productos que vencen en los próximos 30 días")
    public ResponseEntity<ApiResponse<List<ProductoDTO>>> obtenerProductosProximosVencer() {
        return ResponseEntity.ok(inventarioService.obtenerProductosProximosVencer());
    }

    @PostMapping("/ajustar")
    @Operation(summary = "Ajustar inventario", description = "Ajusta el stock de un producto según el inventario físico")
    public ResponseEntity<ApiResponse<Void>> ajustarInventario(
            @RequestParam Long productoId,
            @RequestParam Integer stockFisico
    ) {
        return ResponseEntity.ok(inventarioService.ajustarInventario(productoId, stockFisico));
    }
}
