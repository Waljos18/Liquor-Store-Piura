package com.licoreria.controller;

import com.licoreria.dto.ApiResponse;
import com.licoreria.dto.merma.MermaDTO;
import com.licoreria.dto.merma.RegistrarMermaRequest;
import com.licoreria.entity.Usuario;
import com.licoreria.repository.UsuarioRepository;
import com.licoreria.service.MermaService;
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
@RequestMapping("/api/v1/mermas")
@RequiredArgsConstructor
@Tag(name = "Mermas", description = "API para gestión de mermas de inventario")
public class MermaController {

    private final MermaService mermaService;
    private final UsuarioRepository usuarioRepository;

    @PostMapping
    @Operation(summary = "Registrar una merma")
    public ResponseEntity<ApiResponse<MermaDTO>> registrar(
            @Valid @RequestBody RegistrarMermaRequest request,
            Authentication authentication
    ) {
        Usuario usuario = usuarioRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return ResponseEntity.ok(mermaService.registrar(request, usuario.getId()));
    }

    @GetMapping
    @Operation(summary = "Listar mermas por rango de fechas")
    public ResponseEntity<ApiResponse<Page<MermaDTO>>> listar(
            @RequestParam(required = false) String desde,
            @RequestParam(required = false) String hasta,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size
    ) {
        LocalDate desdeDate = parseFecha(desde);
        LocalDate hastaDate = parseFecha(hasta);
        return ResponseEntity.ok(mermaService.listar(desdeDate, hastaDate, page, size));
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
