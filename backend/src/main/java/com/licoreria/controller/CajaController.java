package com.licoreria.controller;

import com.licoreria.dto.ApiResponse;
import com.licoreria.dto.caja.AbrirCajaRequest;
import com.licoreria.dto.caja.AperturaCajaDTO;
import com.licoreria.dto.caja.CerrarCajaRequest;
import com.licoreria.service.CajaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/caja")
@RequiredArgsConstructor
@Tag(name = "Caja", description = "API para apertura y cierre formal de caja")
public class CajaController {

    private final CajaService cajaService;

    @PostMapping("/apertura")
    @Operation(summary = "Abrir caja", description = "Abre una nueva sesión de caja con monto inicial")
    public ResponseEntity<ApiResponse<AperturaCajaDTO>> abrir(@Valid @RequestBody AbrirCajaRequest request) {
        return ResponseEntity.ok(cajaService.abrir(request));
    }

    @PutMapping("/apertura/{id}/cerrar")
    @Operation(summary = "Cerrar caja", description = "Cierra la sesión activa, calcula sobrante/faltante")
    public ResponseEntity<ApiResponse<AperturaCajaDTO>> cerrar(
            @PathVariable Long id,
            @Valid @RequestBody CerrarCajaRequest request
    ) {
        return ResponseEntity.ok(cajaService.cerrar(id, request));
    }

    @GetMapping("/apertura/activa")
    @Operation(summary = "Sesión activa", description = "Devuelve la sesión de caja actualmente abierta (null si no hay ninguna)")
    public ResponseEntity<ApiResponse<AperturaCajaDTO>> obtenerActiva() {
        return ResponseEntity.ok(cajaService.obtenerActiva());
    }

    @GetMapping("/apertura/{id}")
    @Operation(summary = "Obtener sesión por ID")
    public ResponseEntity<ApiResponse<AperturaCajaDTO>> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(cajaService.obtenerPorId(id));
    }
}
