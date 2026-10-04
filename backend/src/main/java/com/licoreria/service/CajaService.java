package com.licoreria.service;

import com.licoreria.dto.ApiResponse;
import com.licoreria.dto.caja.AbrirCajaRequest;
import com.licoreria.dto.caja.AperturaCajaDTO;
import com.licoreria.dto.caja.CerrarCajaRequest;
import com.licoreria.dto.venta.CierreCajaDTO;
import com.licoreria.entity.AperturaCaja;
import com.licoreria.entity.Usuario;
import com.licoreria.repository.AperturaCajaRepository;
import com.licoreria.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CajaService {

    private final AperturaCajaRepository aperturaCajaRepository;
    private final UsuarioRepository usuarioRepository;
    private final VentaService ventaService;

    /** Horarios de operación de la licorería (ZoneId local) */
    private static final ZoneId TZ = ZoneId.of("America/Lima");

    @Transactional
    public ApiResponse<AperturaCajaDTO> abrir(AbrirCajaRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Usuario usuario = usuarioRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        LocalDate hoy = LocalDate.now(TZ);

        // Verificar si ya hay una caja abierta
        Optional<AperturaCaja> yaAbierta = aperturaCajaRepository.findAbierta();
        if (yaAbierta.isPresent()) {
            return ApiResponse.error("INVALID", "Ya existe una caja abierta. Cierre la sesión actual antes de abrir una nueva.");
        }

        // Validar horario de operación
        String errorHorario = validarHorario();
        if (errorHorario != null) {
            return ApiResponse.error("HORARIO", errorHorario);
        }

        AperturaCaja apertura = AperturaCaja.builder()
                .fecha(hoy)
                .horaApertura(Instant.now())
                .montoInicial(request.getMontoInicial())
                .usuarioApertura(usuario)
                .estado(AperturaCaja.Estado.ABIERTA)
                .observaciones(request.getObservaciones())
                .build();

        apertura = aperturaCajaRepository.save(apertura);
        return ApiResponse.ok(toDto(apertura));
    }

    @Transactional
    public ApiResponse<AperturaCajaDTO> cerrar(Long id, CerrarCajaRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Usuario usuario = usuarioRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        AperturaCaja apertura = aperturaCajaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sesión de caja no encontrada"));

        if (apertura.getEstado() == AperturaCaja.Estado.CERRADA) {
            return ApiResponse.error("INVALID", "Esta sesión de caja ya está cerrada");
        }

        // Obtener cierre del día para calcular ingresos
        CierreCajaDTO cierre = ventaService.getCierreCaja(apertura.getFecha());
        BigDecimal ingresosEfectivo = cierre.getTotalVentas();
        BigDecimal esperado = apertura.getMontoInicial().add(ingresosEfectivo).setScale(2, RoundingMode.HALF_UP);
        BigDecimal montoReal = request.getMontoReal().setScale(2, RoundingMode.HALF_UP);
        BigDecimal sobranteFaltante = montoReal.subtract(esperado);

        apertura.setHoraCierre(Instant.now());
        apertura.setMontoCierre(esperado);
        apertura.setMontoReal(montoReal);
        apertura.setSobranteFaltante(sobranteFaltante);
        apertura.setUsuarioCierre(usuario);
        apertura.setEstado(AperturaCaja.Estado.CERRADA);
        apertura.setObservacionesCierre(request.getObservacionesCierre());

        apertura = aperturaCajaRepository.save(apertura);
        return ApiResponse.ok(toDto(apertura));
    }

    @Transactional(readOnly = true)
    public ApiResponse<AperturaCajaDTO> obtenerActiva() {
        return aperturaCajaRepository.findAbierta()
                .map(a -> ApiResponse.ok(toDto(a)))
                .orElse(ApiResponse.ok(null));
    }

    @Transactional(readOnly = true)
    public ApiResponse<AperturaCajaDTO> obtenerPorId(Long id) {
        return aperturaCajaRepository.findById(id)
                .map(a -> ApiResponse.ok(toDto(a)))
                .orElse(ApiResponse.error("NOT_FOUND", "Sesión de caja no encontrada"));
    }

    /**
     * Valida si el momento actual está dentro del horario de operación:
     * Lun-Jue: 09:00–23:30 | Vie-Sáb: 09:00–03:00 (siguiente día) | Dom: 10:00–22:00
     */
    private String validarHorario() {
        java.time.ZonedDateTime ahora = java.time.ZonedDateTime.now(TZ);
        DayOfWeek dia = ahora.getDayOfWeek();
        LocalTime hora = ahora.toLocalTime();

        boolean dentroDeHorario = switch (dia) {
            case MONDAY, TUESDAY, WEDNESDAY, THURSDAY ->
                    !hora.isBefore(LocalTime.of(9, 0)) && hora.isBefore(LocalTime.of(23, 30));
            case FRIDAY ->
                    !hora.isBefore(LocalTime.of(9, 0)); // hasta las 3am del sábado
            case SATURDAY ->
                    hora.isBefore(LocalTime.of(3, 0)) || !hora.isBefore(LocalTime.of(9, 0));
            case SUNDAY ->
                    !hora.isBefore(LocalTime.of(10, 0)) && hora.isBefore(LocalTime.of(22, 0));
        };

        if (!dentroDeHorario) {
            return "La licorería está fuera del horario de operación. " +
                   "Lun-Jue: 9:00-23:30 | Vie-Sáb: 9:00-3:00 | Dom: 10:00-22:00";
        }
        return null;
    }

    private AperturaCajaDTO toDto(AperturaCaja a) {
        AperturaCajaDTO dto = new AperturaCajaDTO();
        dto.setId(a.getId());
        dto.setFecha(a.getFecha());
        dto.setHoraApertura(a.getHoraApertura());
        dto.setHoraCierre(a.getHoraCierre());
        dto.setMontoInicial(a.getMontoInicial());
        dto.setMontoCierre(a.getMontoCierre());
        dto.setMontoReal(a.getMontoReal());
        dto.setSobranteFaltante(a.getSobranteFaltante());
        dto.setEstado(a.getEstado().name());
        dto.setObservaciones(a.getObservaciones());
        dto.setObservacionesCierre(a.getObservacionesCierre());
        if (a.getUsuarioApertura() != null) dto.setUsuarioAperturaNombre(a.getUsuarioApertura().getNombre());
        if (a.getUsuarioCierre() != null) dto.setUsuarioCierreNombre(a.getUsuarioCierre().getNombre());
        return dto;
    }
}
