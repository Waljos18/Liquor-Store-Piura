package com.licoreria.dto.fidelizacion;

import lombok.Data;

@Data
public class PuntosMovimientoDTO {
    private Long id;
    private String tipo;
    private Integer cantidad;
    private Integer saldoDespues;
    private String motivo;
    private String ventaNumero;
    private String fecha;
}
