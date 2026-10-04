package com.licoreria.controller;

import com.licoreria.dto.ApiResponse;
import com.licoreria.dto.fidelizacion.*;
import com.licoreria.repository.UsuarioRepository;
import com.licoreria.service.FidelizacionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/fidelizacion")
@RequiredArgsConstructor
@Tag(name = "Fidelización", description = "API para gestión de puntos de fidelización de clientes")
public class FidelizacionController {

    private final FidelizacionService fidelizacionService;
    private final UsuarioRepository usuarioRepository;

    @GetMapping("/config")
    @Operation(summary = "Obtener configuración de fidelización")
    public ResponseEntity<ApiResponse<ConfigFidelizacionDTO>> getConfig() {
        return ResponseEntity.ok(fidelizacionService.getConfig());
    }

    @PutMapping("/config")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Actualizar configuración de fidelización (solo ADMIN)")
    public ResponseEntity<ApiResponse<ConfigFidelizacionDTO>> updateConfig(
            @RequestBody UpdateConfigFidelizacionRequest req) {
        return ResponseEntity.ok(fidelizacionService.updateConfig(req));
    }

    @GetMapping("/historial/{clienteId}")
    @Operation(summary = "Historial de puntos de un cliente")
    public ResponseEntity<ApiResponse<Page<PuntosMovimientoDTO>>> getHistorial(
            @PathVariable Long clienteId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(fidelizacionService.getHistorial(clienteId, page, size));
    }

    @PostMapping("/ajuste")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Ajuste manual de puntos (solo ADMIN)")
    public ResponseEntity<ApiResponse<Void>> ajusteManual(
            @Valid @RequestBody AjusteManualRequest req,
            Authentication authentication) {
        Long usuarioId = usuarioRepository.findByUsername(authentication.getName())
                .map(u -> u.getId()).orElse(null);
        return ResponseEntity.ok(fidelizacionService.ajusteManual(req, usuarioId));
    }
}
