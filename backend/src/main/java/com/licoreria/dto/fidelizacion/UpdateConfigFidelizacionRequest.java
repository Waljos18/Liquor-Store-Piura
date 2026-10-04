package com.licoreria.dto.fidelizacion;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateConfigFidelizacionRequest {
    private BigDecimal solesPorPunto;
    private BigDecimal puntosPorSolDescuento;
    private Integer maxPuntosCanjeporVenta;
    private BigDecimal minCompraParaCanje;
    private Boolean activo;
}
