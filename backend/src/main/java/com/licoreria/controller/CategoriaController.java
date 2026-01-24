package com.licoreria.controller;

import com.licoreria.dto.ApiResponse;
import com.licoreria.dto.CategoriaDTO;
import com.licoreria.service.CategoriaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categorias")
@RequiredArgsConstructor
@Tag(name = "Categorías", description = "CRUD categorías de productos")
public class CategoriaController {

    private final CategoriaService categoriaService;

    @GetMapping
    @Operation(summary = "Listar categorías")
    public ResponseEntity<ApiResponse<List<CategoriaDTO>>> listar(
            @RequestParam(required = false, defaultValue = "true") boolean soloActivas) {
        return ResponseEntity.ok(categoriaService.listar(soloActivas));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener categoría por ID")
    public ResponseEntity<ApiResponse<CategoriaDTO>> obtener(@PathVariable Long id) {
        ApiResponse<CategoriaDTO> res = categoriaService.obtenerPorId(id);
        if (!res.isSuccess()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(res);
        return ResponseEntity.ok(res);
    }

    @PostMapping
    @Operation(summary = "Crear categoría")
    public ResponseEntity<ApiResponse<CategoriaDTO>> crear(@Valid @RequestBody CategoriaDTO dto) {
        ApiResponse<CategoriaDTO> res = categoriaService.crear(dto);
        if (!res.isSuccess() && "CONFLICT".equals(res.getError().getCode())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(res);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar categoría")
    public ResponseEntity<ApiResponse<CategoriaDTO>> actualizar(@PathVariable Long id, @Valid @RequestBody CategoriaDTO dto) {
        ApiResponse<CategoriaDTO> res = categoriaService.actualizar(id, dto);
        if (!res.isSuccess() && "NOT_FOUND".equals(res.getError().getCode())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(res);
        }
        if (!res.isSuccess() && "CONFLICT".equals(res.getError().getCode())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(res);
        }
        return ResponseEntity.ok(res);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar categoría")
    public ResponseEntity<ApiResponse<Void>> eliminar(@PathVariable Long id) {
        ApiResponse<Void> res = categoriaService.eliminar(id);
        if (!res.isSuccess()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(res);
        return ResponseEntity.ok(res);
    }
}
