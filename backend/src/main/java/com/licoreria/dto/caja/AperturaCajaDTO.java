package com.licoreria.dto.caja;

import lombok.Data;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Data
public class AperturaCajaDTO {
    private Long id;
    private LocalDate fecha;
    private Instant horaApertura;
    private Instant horaCierre;
    private BigDecimal montoInicial;
    private BigDecimal montoCierre;
    private BigDecimal montoReal;
    private BigDecimal sobranteFaltante;
    private String usuarioAperturaNombre;
    private String usuarioCierreNombre;
    private String estado;
    private String observaciones;
    private String observacionesCierre;
}
