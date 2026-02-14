package com.licoreria.controller;

import com.licoreria.dto.ApiResponse;
import com.licoreria.dto.ImportarProductosResultDTO;
import com.licoreria.dto.ProductoDTO;
import com.licoreria.service.ProductoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/api/v1/productos")
@RequiredArgsConstructor
@Tag(name = "Productos", description = "CRUD productos y búsqueda POS")
public class ProductoController {

    private final ProductoService productoService;

    @GetMapping
    @Operation(summary = "Listar productos con filtros y paginación")
    public ResponseEntity<ApiResponse<?>> listar(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoriaId,
            @RequestParam(required = false) Boolean activo,
            @RequestParam(required = false) Boolean stockBajo,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(productoService.listar(search, categoriaId, activo, stockBajo, pageable));
    }

    @GetMapping("/buscar")
    @Operation(summary = "Búsqueda rápida para POS (código o nombre)")
    public ResponseEntity<ApiResponse<List<ProductoDTO>>> buscar(@RequestParam("q") String q) {
        return ResponseEntity.ok(productoService.buscarParaPos(q));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener producto por ID")
    public ResponseEntity<ApiResponse<ProductoDTO>> obtener(@PathVariable Long id) {
        ApiResponse<ProductoDTO> res = productoService.obtenerPorId(id);
        if (!res.isSuccess()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(res);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/importar")
    @Operation(summary = "Importar productos desde archivo CSV")
    public ResponseEntity<ApiResponse<ImportarProductosResultDTO>> importar(
            @RequestParam("archivo") MultipartFile archivo) {
        try {
            String csvContent = new String(archivo.getBytes(), StandardCharsets.UTF_8);
            return ResponseEntity.ok(productoService.importarDesdeCsv(csvContent));
        } catch (IOException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("ERROR", "No se pudo leer el archivo: " + e.getMessage()));
        }
    }

    @PostMapping("/importar/texto")
    @Operation(summary = "Importar productos desde contenido CSV (texto)")
    public ResponseEntity<ApiResponse<ImportarProductosResultDTO>> importarTexto(@RequestBody String csvContent) {
        return ResponseEntity.ok(productoService.importarDesdeCsv(csvContent));
    }

    @PostMapping
    @Operation(summary = "Crear producto")
    public ResponseEntity<ApiResponse<ProductoDTO>> crear(@Valid @RequestBody ProductoDTO dto) {
        ApiResponse<ProductoDTO> res = productoService.crear(dto);
        if (!res.isSuccess() && "CONFLICT".equals(res.getError().getCode())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(res);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar producto")
    public ResponseEntity<ApiResponse<ProductoDTO>> actualizar(@PathVariable Long id, @Valid @RequestBody ProductoDTO dto) {
        ApiResponse<ProductoDTO> res = productoService.actualizar(id, dto);
        if (!res.isSuccess() && "NOT_FOUND".equals(res.getError().getCode())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(res);
        }
        if (!res.isSuccess() && "CONFLICT".equals(res.getError().getCode())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(res);
        }
        return ResponseEntity.ok(res);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Desactivar producto (eliminación lógica)")
    public ResponseEntity<ApiResponse<Void>> eliminar(@PathVariable Long id) {
        ApiResponse<Void> res = productoService.eliminar(id);
        if (!res.isSuccess()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(res);
        return ResponseEntity.ok(res);
    }
}
