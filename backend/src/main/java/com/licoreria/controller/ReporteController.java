package com.licoreria.controller;

import com.licoreria.dto.ApiResponse;
import com.licoreria.dto.reporte.DashboardDTO;
import com.licoreria.dto.reporte.ProductoMasVendidoDTO;
import com.licoreria.dto.reporte.ReporteInventarioDTO;
import com.licoreria.dto.reporte.ReporteVentasDTO;
import com.licoreria.service.ReporteService;
import com.lowagie.text.DocumentException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/reportes")
@RequiredArgsConstructor
@Tag(name = "Reportes", description = "API para reportes de ventas e inventario")
public class ReporteController {

    private final ReporteService reporteService;

    @GetMapping("/dashboard")
    @Operation(summary = "Datos del dashboard", description = "Métricas rápidas: ventas hoy, productos, alertas")
    public ResponseEntity<ApiResponse<DashboardDTO>> dashboard() {
        return ResponseEntity.ok(ApiResponse.ok(reporteService.obtenerDashboard()));
    }

    @GetMapping("/ventas")
    @Operation(summary = "Reporte de ventas", description = "Obtiene resumen de ventas por período")
    public ResponseEntity<ApiResponse<ReporteVentasDTO>> reporteVentas(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin,
            @RequestParam(required = false, defaultValue = "DIA") String agrupacion
    ) {
        return ResponseEntity.ok(ApiResponse.ok(reporteService.obtenerReporteVentas(fechaInicio, fechaFin, agrupacion)));
    }

    @GetMapping("/ventas/pdf")
    @Operation(summary = "Descargar reporte de ventas en PDF")
    public ResponseEntity<byte[]> reporteVentasPDF(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin
    ) throws DocumentException {
        byte[] pdf = reporteService.generarReporteVentasPDF(fechaInicio, fechaFin);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=reporte-ventas-" + fechaInicio + "-" + fechaFin + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @GetMapping("/productos-mas-vendidos")
    @Operation(summary = "Top productos más vendidos")
    public ResponseEntity<ApiResponse<List<ProductoMasVendidoDTO>>> productosMasVendidos(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin,
            @RequestParam(required = false, defaultValue = "10") int limite
    ) {
        return ResponseEntity.ok(ApiResponse.ok(reporteService.obtenerProductosMasVendidos(fechaInicio, fechaFin, limite)));
    }

    @GetMapping("/inventario")
    @Operation(summary = "Reporte de inventario")
    public ResponseEntity<ApiResponse<ReporteInventarioDTO>> reporteInventario() {
        return ResponseEntity.ok(ApiResponse.ok(reporteService.obtenerReporteInventario()));
    }

    @GetMapping("/inventario/pdf")
    @Operation(summary = "Descargar reporte de inventario en PDF")
    public ResponseEntity<byte[]> reporteInventarioPDF() throws DocumentException {
        byte[] pdf = reporteService.generarReporteInventarioPDF();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=reporte-inventario.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}
