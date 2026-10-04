package com.licoreria.service;

import com.licoreria.dto.ApiResponse;
import com.licoreria.dto.cuenta.CuentaPorCobrarDTO;
import com.licoreria.dto.cuenta.PagoCuentaDTO;
import com.licoreria.dto.cuenta.PagarCuentaRequest;
import com.licoreria.entity.*;
import com.licoreria.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CuentaPorCobrarService {

    private final CuentaPorCobrarRepository cuentaRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional(readOnly = true)
    public ApiResponse<Page<CuentaPorCobrarDTO>> listar(String estado, Long clienteId, Pageable pageable) {
        Page<CuentaPorCobrar> page;
        if (clienteId != null) {
            page = cuentaRepository.findByClienteId(clienteId, pageable);
        } else if (estado != null) {
            page = cuentaRepository.findByEstado(CuentaPorCobrar.Estado.valueOf(estado), pageable);
        } else {
            page = cuentaRepository.findAll(pageable);
        }
        return ApiResponse.ok(page.map(this::toDto));
    }

    @Transactional(readOnly = true)
    public ApiResponse<CuentaPorCobrarDTO> obtenerPorId(Long id) {
        return cuentaRepository.findById(id)
                .map(c -> ApiResponse.ok(toDto(c)))
                .orElse(ApiResponse.error("NOT_FOUND", "Cuenta no encontrada"));
    }

    @Transactional(readOnly = true)
    public ApiResponse<BigDecimal> saldoCliente(Long clienteId) {
        return ApiResponse.ok(cuentaRepository.sumSaldoPendienteByClienteId(clienteId));
    }

    @Transactional
    public ApiResponse<CuentaPorCobrarDTO> registrarPago(Long id, PagarCuentaRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Usuario usuario = usuarioRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        CuentaPorCobrar cuenta = cuentaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cuenta no encontrada"));

        if (cuenta.getEstado() == CuentaPorCobrar.Estado.PAGADO) {
            return ApiResponse.error("INVALID", "Esta cuenta ya está completamente pagada");
        }

        BigDecimal monto = request.getMonto().setScale(2, RoundingMode.HALF_UP);
        if (monto.compareTo(cuenta.getSaldoPendiente()) > 0) {
            return ApiResponse.error("INVALID",
                    "El monto (" + monto + ") supera el saldo pendiente (" + cuenta.getSaldoPendiente() + ")");
        }

        PagoCuenta.FormaPago formaPago;
        try {
            formaPago = PagoCuenta.FormaPago.valueOf(request.getFormaPago().toUpperCase());
        } catch (IllegalArgumentException e) {
            return ApiResponse.error("INVALID", "Forma de pago inválida: " + request.getFormaPago());
        }

        PagoCuenta pago = PagoCuenta.builder()
                .cuenta(cuenta)
                .monto(monto)
                .fecha(Instant.now())
                .usuario(usuario)
                .formaPago(formaPago)
                .observaciones(request.getObservaciones())
                .build();
        cuenta.getPagos().add(pago);

        BigDecimal nuevoMontoPagado = cuenta.getMontoPagado().add(monto);
        BigDecimal nuevoSaldo = cuenta.getMontoTotal().subtract(nuevoMontoPagado).setScale(2, RoundingMode.HALF_UP);

        cuenta.setMontoPagado(nuevoMontoPagado);
        cuenta.setSaldoPendiente(nuevoSaldo);
        if (nuevoSaldo.compareTo(BigDecimal.ZERO) <= 0) {
            cuenta.setEstado(CuentaPorCobrar.Estado.PAGADO);
        }

        cuenta = cuentaRepository.save(cuenta);
        return ApiResponse.ok(toDto(cuenta));
    }

    public CuentaPorCobrarDTO toDto(CuentaPorCobrar c) {
        CuentaPorCobrarDTO dto = new CuentaPorCobrarDTO();
        dto.setId(c.getId());
        if (c.getVenta() != null) {
            dto.setVentaId(c.getVenta().getId());
            dto.setNumeroVenta(c.getVenta().getNumeroVenta());
        }
        dto.setClienteId(c.getCliente().getId());
        dto.setClienteNombre(c.getCliente().getNombre());
        dto.setClienteDocumento(c.getCliente().getNumeroDocumento());
        dto.setMontoTotal(c.getMontoTotal());
        dto.setMontoPagado(c.getMontoPagado());
        dto.setSaldoPendiente(c.getSaldoPendiente());
        dto.setEstado(c.getEstado().name());
        dto.setFechaVencimiento(c.getFechaVencimiento());
        dto.setObservaciones(c.getObservaciones());
        dto.setFechaCreacion(c.getFechaCreacion());

        if (c.getPagos() != null) {
            dto.setPagos(c.getPagos().stream().map(p -> {
                PagoCuentaDTO pd = new PagoCuentaDTO();
                pd.setId(p.getId());
                pd.setMonto(p.getMonto());
                pd.setFecha(p.getFecha());
                pd.setUsuarioNombre(p.getUsuario().getNombre());
                pd.setFormaPago(p.getFormaPago().name());
                pd.setObservaciones(p.getObservaciones());
                return pd;
            }).collect(Collectors.toList()));
        }
        return dto;
    }
}
