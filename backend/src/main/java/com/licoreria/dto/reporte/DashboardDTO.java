package com.licoreria.dto.reporte;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class DashboardDTO {

    private BigDecimal ventasHoy;
    private BigDecimal gananciasHoy;  // suma de (precio venta - precio compra) por unidad vendida
    private long transaccionesHoy;
    private long productosActivos;
    private long productosStockBajo;
    private long productosProximosVencer;
}
