package com.licoreria.controller;

import com.licoreria.dto.ApiResponse;
import com.licoreria.dto.UsuarioDTO;
import com.licoreria.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/usuarios")
@RequiredArgsConstructor
@Tag(name = "Usuarios", description = "CRUD usuarios (Admin y Vendedor)")
@PreAuthorize("hasRole('ADMIN')")
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping
    @Operation(summary = "Listar usuarios paginado")
    public ResponseEntity<ApiResponse<?>> listar(@PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(usuarioService.listar(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener usuario por ID")
    public ResponseEntity<ApiResponse<UsuarioDTO>> obtener(@PathVariable Long id) {
        ApiResponse<UsuarioDTO> res = usuarioService.obtenerPorId(id);
        if (!res.isSuccess()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(res);
        return ResponseEntity.ok(res);
    }

    @PostMapping
    @Operation(summary = "Crear usuario")
    public ResponseEntity<ApiResponse<UsuarioDTO>> crear(@Valid @RequestBody UsuarioDTO dto) {
        ApiResponse<UsuarioDTO> res = usuarioService.crear(dto);
        if (!res.isSuccess() && "CONFLICT".equals(res.getError().getCode())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(res);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar usuario")
    public ResponseEntity<ApiResponse<UsuarioDTO>> actualizar(@PathVariable Long id, @Valid @RequestBody UsuarioDTO dto) {
        ApiResponse<UsuarioDTO> res = usuarioService.actualizar(id, dto);
        if (!res.isSuccess() && "NOT_FOUND".equals(res.getError().getCode())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(res);
        }
        if (!res.isSuccess() && "CONFLICT".equals(res.getError().getCode())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(res);
        }
        return ResponseEntity.ok(res);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar usuario")
    public ResponseEntity<ApiResponse<Void>> eliminar(@PathVariable Long id) {
        ApiResponse<Void> res = usuarioService.eliminar(id);
        if (!res.isSuccess()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(res);
        return ResponseEntity.ok(res);
    }
}
