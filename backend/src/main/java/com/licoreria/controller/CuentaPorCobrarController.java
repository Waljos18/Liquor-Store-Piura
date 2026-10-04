package com.licoreria.controller;

import com.licoreria.dto.ApiResponse;
import com.licoreria.dto.cuenta.CuentaPorCobrarDTO;
import com.licoreria.dto.cuenta.PagarCuentaRequest;
import com.licoreria.service.CuentaPorCobrarService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/v1/cuentas-cobrar")
@RequiredArgsConstructor
@Tag(name = "Cuentas por Cobrar", description = "API para gestión de ventas a crédito / fiado")
public class CuentaPorCobrarController {

    private final CuentaPorCobrarService cuentaService;

    @GetMapping
    @Operation(summary = "Listar cuentas por cobrar")
    public ResponseEntity<ApiResponse<Page<CuentaPorCobrarDTO>>> listar(
            @RequestParam(required = false) String estado,
            @RequestParam(required = false) Long clienteId,
            Pageable pageable
    ) {
        return ResponseEntity.ok(cuentaService.listar(estado, clienteId, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener cuenta por ID")
    public ResponseEntity<ApiResponse<CuentaPorCobrarDTO>> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(cuentaService.obtenerPorId(id));
    }

    @GetMapping("/cliente/{clienteId}/saldo")
    @Operation(summary = "Saldo total de un cliente")
    public ResponseEntity<ApiResponse<BigDecimal>> saldoCliente(@PathVariable Long clienteId) {
        return ResponseEntity.ok(cuentaService.saldoCliente(clienteId));
    }

    @PostMapping("/{id}/pagar")
    @Operation(summary = "Registrar pago de cuenta")
    public ResponseEntity<ApiResponse<CuentaPorCobrarDTO>> pagar(
            @PathVariable Long id,
            @Valid @RequestBody PagarCuentaRequest request
    ) {
        return ResponseEntity.ok(cuentaService.registrarPago(id, request));
    }
}
