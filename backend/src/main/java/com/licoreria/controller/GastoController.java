package com.licoreria.controller;

import com.licoreria.dto.ApiResponse;
import com.licoreria.dto.gasto.CrearGastoRequest;
import com.licoreria.dto.gasto.GastoDTO;
import com.licoreria.entity.Usuario;
import com.licoreria.repository.UsuarioRepository;
import com.licoreria.service.GastoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;

@RestController
@RequestMapping("/api/v1/gastos")
@RequiredArgsConstructor
@Tag(name = "Gastos", description = "API para gestión de gastos operativos")
public class GastoController {

    private final GastoService gastoService;
    private final UsuarioRepository usuarioRepository;

    @GetMapping
    @Operation(summary = "Listar gastos por rango de fechas")
    public ResponseEntity<ApiResponse<Page<GastoDTO>>> listar(
            @RequestParam(required = false) String desde,
            @RequestParam(required = false) String hasta,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size
    ) {
        LocalDate desdeDate = parseFecha(desde);
        LocalDate hastaDate = parseFecha(hasta);
        return ResponseEntity.ok(gastoService.listar(desdeDate, hastaDate, page, size));
    }

    @PostMapping
    @Operation(summary = "Registrar un gasto operativo")
    public ResponseEntity<ApiResponse<GastoDTO>> crear(
            @Valid @RequestBody CrearGastoRequest request,
            Authentication authentication
    ) {
        Usuario usuario = usuarioRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return ResponseEntity.ok(gastoService.crear(request, usuario.getId()));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar gasto (solo ADMIN)")
    public ResponseEntity<ApiResponse<Void>> eliminar(@PathVariable Long id) {
        return ResponseEntity.ok(gastoService.eliminar(id));
    }

    private LocalDate parseFecha(String fecha) {
        if (fecha == null || fecha.isBlank()) return null;
        try {
            return LocalDate.parse(fecha);
        } catch (DateTimeParseException e) {
            return null;
        }
    }
}
