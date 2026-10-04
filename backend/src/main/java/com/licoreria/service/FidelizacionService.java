package com.licoreria.service;

import com.licoreria.dto.ApiResponse;
import com.licoreria.dto.fidelizacion.*;
import com.licoreria.entity.*;
import com.licoreria.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
public class FidelizacionService {

    private final ConfigFidelizacionRepository configRepo;
    private final PuntosMovimientoRepository movimientoRepo;
    private final ClienteRepository clienteRepo;
    private final UsuarioRepository usuarioRepo;
    private final VentaRepository ventaRepo;

    // --- Config ---

    @Transactional(readOnly = true)
    public ApiResponse<ConfigFidelizacionDTO> getConfig() {
        ConfigFidelizacion cfg = configRepo.findFirstByOrderByIdAsc()
                .orElseGet(() -> ConfigFidelizacion.builder()
                        .solesPorPunto(new BigDecimal("5"))
                        .puntosPorSolDescuento(new BigDecimal("20"))
                        .maxPuntosCanjeporVenta(500)
                        .minCompraParaCanje(new BigDecimal("20"))
                        .activo(true)
                        .build());
        return ApiResponse.ok(toConfigDTO(cfg));
    }

    @Transactional
    public ApiResponse<ConfigFidelizacionDTO> updateConfig(UpdateConfigFidelizacionRequest req) {
        ConfigFidelizacion cfg = configRepo.findFirstByOrderByIdAsc().orElse(new ConfigFidelizacion());
        if (req.getSolesPorPunto() != null) cfg.setSolesPorPunto(req.getSolesPorPunto());
        if (req.getPuntosPorSolDescuento() != null) cfg.setPuntosPorSolDescuento(req.getPuntosPorSolDescuento());
        if (req.getMaxPuntosCanjeporVenta() != null) cfg.setMaxPuntosCanjeporVenta(req.getMaxPuntosCanjeporVenta());
        if (req.getMinCompraParaCanje() != null) cfg.setMinCompraParaCanje(req.getMinCompraParaCanje());
        if (req.getActivo() != null) cfg.setActivo(req.getActivo());
        cfg.setFechaActualizacion(java.time.Instant.now());
        cfg = configRepo.save(cfg);
        return ApiResponse.ok(toConfigDTO(cfg));
    }

    // --- Acumulación (llamado desde VentaService) ---

    @Transactional
    public void acumularPuntos(Long clienteId, BigDecimal totalVenta, Long ventaId, Long usuarioId) {
        ConfigFidelizacion cfg = configRepo.findFirstByOrderByIdAsc().orElse(null);
        if (cfg == null || !Boolean.TRUE.equals(cfg.getActivo())) return;

        int puntosGanados = totalVenta.divide(cfg.getSolesPorPunto(), 0, RoundingMode.DOWN).intValue();
        if (puntosGanados <= 0) return;

        Cliente cliente = clienteRepo.findById(clienteId).orElse(null);
        if (cliente == null) return;

        int saldoAnterior = cliente.getPuntosFidelizacion() != null ? cliente.getPuntosFidelizacion() : 0;
        int saldoNuevo = saldoAnterior + puntosGanados;
        cliente.setPuntosFidelizacion(saldoNuevo);
        clienteRepo.save(cliente);

        PuntosMovimiento mov = new PuntosMovimiento();
        mov.setCliente(cliente);
        mov.setTipo(PuntosMovimiento.Tipo.ACUMULACION);
        mov.setCantidad(puntosGanados);
        mov.setSaldoDespues(saldoNuevo);
        mov.setMotivo("Acumulación por venta");
        mov.setFecha(java.time.Instant.now());
        if (ventaId != null) mov.setVenta(ventaRepo.getReferenceById(ventaId));
        if (usuarioId != null) mov.setUsuario(usuarioRepo.getReferenceById(usuarioId));
        movimientoRepo.save(mov);
    }

    // --- Validar canje (llamado desde VentaService antes de crear venta) ---

    @Transactional(readOnly = true)
    public ApiResponse<BigDecimal> validarCanje(Long clienteId, Integer puntosCanjeados, BigDecimal totalVenta) {
        ConfigFidelizacion cfg = configRepo.findFirstByOrderByIdAsc().orElse(null);
        if (cfg == null || !Boolean.TRUE.equals(cfg.getActivo())) {
            return ApiResponse.error("FIDELIZACION_INACTIVA", "El sistema de puntos no está activo");
        }
        Cliente cliente = clienteRepo.findById(clienteId)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        int puntosDisponibles = cliente.getPuntosFidelizacion() != null ? cliente.getPuntosFidelizacion() : 0;
        if (puntosDisponibles < puntosCanjeados) {
            return ApiResponse.error("PUNTOS_INSUFICIENTES", "El cliente solo tiene " + puntosDisponibles + " puntos");
        }
        if (puntosCanjeados > cfg.getMaxPuntosCanjeporVenta()) {
            return ApiResponse.error("MAX_CANJE", "Máximo " + cfg.getMaxPuntosCanjeporVenta() + " puntos por venta");
        }
        if (cfg.getMinCompraParaCanje() != null && totalVenta.compareTo(cfg.getMinCompraParaCanje()) < 0) {
            return ApiResponse.error("MIN_COMPRA", "Mínimo S/ " + cfg.getMinCompraParaCanje() + " para canjear puntos");
        }
        // calcular descuento: puntosCanjeados / puntosPorSolDescuento
        BigDecimal descuento = BigDecimal.valueOf(puntosCanjeados)
                .divide(cfg.getPuntosPorSolDescuento(), 2, RoundingMode.DOWN);
        return ApiResponse.ok(descuento);
    }

    // --- Restar puntos canjeados (llamado desde VentaService después de persistir venta) ---

    @Transactional
    public void restarPuntosCanje(Long clienteId, Integer puntosCanjeados, Long ventaId, Long usuarioId) {
        Cliente cliente = clienteRepo.findById(clienteId).orElse(null);
        if (cliente == null) return;

        int saldoNuevo = Math.max(0, (cliente.getPuntosFidelizacion() != null ? cliente.getPuntosFidelizacion() : 0) - puntosCanjeados);
        cliente.setPuntosFidelizacion(saldoNuevo);
        clienteRepo.save(cliente);

        PuntosMovimiento mov = new PuntosMovimiento();
        mov.setCliente(cliente);
        mov.setTipo(PuntosMovimiento.Tipo.CANJE);
        mov.setCantidad(-puntosCanjeados);
        mov.setSaldoDespues(saldoNuevo);
        mov.setMotivo("Canje de puntos en venta");
        mov.setFecha(java.time.Instant.now());
        if (ventaId != null) mov.setVenta(ventaRepo.getReferenceById(ventaId));
        if (usuarioId != null) mov.setUsuario(usuarioRepo.getReferenceById(usuarioId));
        movimientoRepo.save(mov);
    }

    // --- Ajuste manual (admin) ---

    @Transactional
    public ApiResponse<Void> ajusteManual(AjusteManualRequest req, Long usuarioId) {
        Cliente cliente = clienteRepo.findById(req.getClienteId())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        int saldoActual = cliente.getPuntosFidelizacion() != null ? cliente.getPuntosFidelizacion() : 0;
        int saldoNuevo = Math.max(0, saldoActual + req.getCantidad());
        cliente.setPuntosFidelizacion(saldoNuevo);
        clienteRepo.save(cliente);

        PuntosMovimiento mov = new PuntosMovimiento();
        mov.setCliente(cliente);
        mov.setTipo(PuntosMovimiento.Tipo.AJUSTE_MANUAL);
        mov.setCantidad(req.getCantidad());
        mov.setSaldoDespues(saldoNuevo);
        mov.setMotivo(req.getMotivo() != null ? req.getMotivo() : "Ajuste manual");
        mov.setFecha(java.time.Instant.now());
        if (usuarioId != null) mov.setUsuario(usuarioRepo.getReferenceById(usuarioId));
        movimientoRepo.save(mov);

        return ApiResponse.ok(null);
    }

    // --- Historial ---

    @Transactional(readOnly = true)
    public ApiResponse<Page<PuntosMovimientoDTO>> getHistorial(Long clienteId, int page, int size) {
        Page<PuntosMovimiento> resultPage = movimientoRepo.findByClienteIdOrderByFechaDesc(
                clienteId, PageRequest.of(page, size));
        return ApiResponse.ok(resultPage.map(this::toMovDTO));
    }

    // --- Helpers ---

    private ConfigFidelizacionDTO toConfigDTO(ConfigFidelizacion cfg) {
        ConfigFidelizacionDTO dto = new ConfigFidelizacionDTO();
        dto.setId(cfg.getId());
        dto.setSolesPorPunto(cfg.getSolesPorPunto());
        dto.setPuntosPorSolDescuento(cfg.getPuntosPorSolDescuento());
        dto.setMaxPuntosCanjeporVenta(cfg.getMaxPuntosCanjeporVenta());
        dto.setMinCompraParaCanje(cfg.getMinCompraParaCanje());
        dto.setActivo(cfg.getActivo());
        return dto;
    }

    private PuntosMovimientoDTO toMovDTO(PuntosMovimiento m) {
        PuntosMovimientoDTO dto = new PuntosMovimientoDTO();
        dto.setId(m.getId());
        dto.setTipo(m.getTipo().name());
        dto.setCantidad(m.getCantidad());
        dto.setSaldoDespues(m.getSaldoDespues());
        dto.setMotivo(m.getMotivo());
        dto.setVentaNumero(m.getVenta() != null ? m.getVenta().getNumeroVenta() : null);
        dto.setFecha(m.getFecha() != null ? m.getFecha().toString() : null);
        return dto;
    }
}
