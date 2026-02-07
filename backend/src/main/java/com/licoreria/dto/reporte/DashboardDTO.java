package com.licoreria.dto.reporte;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class DashboardDTO {

    private BigDecimal ventasHoy;
    private long transaccionesHoy;
    private long productosActivos;
    private long productosStockBajo;
    private long productosProximosVencer;
}
