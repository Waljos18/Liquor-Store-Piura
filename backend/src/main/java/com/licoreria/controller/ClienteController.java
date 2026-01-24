package com.licoreria.controller;

import com.licoreria.dto.ApiResponse;
import com.licoreria.dto.ClienteDTO;
import com.licoreria.service.ClienteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/clientes")
@RequiredArgsConstructor
@Tag(name = "Clientes", description = "CRUD clientes")
public class ClienteController {

    private final ClienteService clienteService;

    @GetMapping
    @Operation(summary = "Listar clientes con búsqueda y paginación")
    public ResponseEntity<ApiResponse<?>> listar(
            @RequestParam(required = false) String search,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(clienteService.listar(search, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener cliente por ID")
    public ResponseEntity<ApiResponse<ClienteDTO>> obtener(@PathVariable Long id) {
        ApiResponse<ClienteDTO> res = clienteService.obtenerPorId(id);
        if (!res.isSuccess()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(res);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/documento/{numeroDocumento}")
    @Operation(summary = "Obtener cliente por número de documento")
    public ResponseEntity<ApiResponse<ClienteDTO>> porDocumento(@PathVariable String numeroDocumento) {
        ApiResponse<ClienteDTO> res = clienteService.obtenerPorDocumento(numeroDocumento);
        if (!res.isSuccess()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(res);
        return ResponseEntity.ok(res);
    }

    @PostMapping
    @Operation(summary = "Crear cliente")
    public ResponseEntity<ApiResponse<ClienteDTO>> crear(@Valid @RequestBody ClienteDTO dto) {
        ApiResponse<ClienteDTO> res = clienteService.crear(dto);
        if (!res.isSuccess() && "CONFLICT".equals(res.getError().getCode())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(res);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar cliente")
    public ResponseEntity<ApiResponse<ClienteDTO>> actualizar(@PathVariable Long id, @Valid @RequestBody ClienteDTO dto) {
        ApiResponse<ClienteDTO> res = clienteService.actualizar(id, dto);
        if (!res.isSuccess() && "NOT_FOUND".equals(res.getError().getCode())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(res);
        }
        if (!res.isSuccess() && "CONFLICT".equals(res.getError().getCode())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(res);
        }
        return ResponseEntity.ok(res);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar cliente")
    public ResponseEntity<ApiResponse<Void>> eliminar(@PathVariable Long id) {
        ApiResponse<Void> res = clienteService.eliminar(id);
        if (!res.isSuccess()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(res);
        return ResponseEntity.ok(res);
    }
}
