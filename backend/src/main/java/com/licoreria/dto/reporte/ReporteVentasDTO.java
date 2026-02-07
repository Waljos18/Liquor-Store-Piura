package com.licoreria.dto.reporte;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ReporteVentasDTO {

    private BigDecimal totalVentas;
    private long totalTransacciones;
    private BigDecimal ticketPromedio;
    private List<VentaPorDiaDTO> ventasPorDia;
    private List<VentaPorFormaPagoDTO> ventasPorFormaPago;

    @Data
    public static class VentaPorDiaDTO {
        private String fecha;
        private BigDecimal total;
        private long transacciones;
    }

    @Data
    public static class VentaPorFormaPagoDTO {
        private String formaPago;
        private BigDecimal total;
        private long cantidad;
    }
}
