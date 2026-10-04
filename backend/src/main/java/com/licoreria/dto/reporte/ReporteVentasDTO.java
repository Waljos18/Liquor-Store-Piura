package com.licoreria.dto.reporte;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ReporteVentasDTO {

    private BigDecimal totalVentas;
    private long totalTransacciones;
    private BigDecimal ticketPromedio;
    private BigDecimal ganancias;  // suma de (precio venta − precio compra) por unidad en el período
    private List<VentaPorDiaDTO> ventasPorDia;
    private List<VentaPorFormaPagoDTO> ventasPorFormaPago;
    private List<VentasPorCategoriaDTO> ventasPorCategoria;

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

    @Data
    public static class VentasPorCategoriaDTO {
        private String categoria;
        private BigDecimal total;
        private long cantidadVendida;
    }

    private BigDecimal totalGastos;
    private BigDecimal gananciaNeta;  // ganancias - totalGastos

    private List<VentasPorVendedorDTO> ventasPorVendedor;

    @Data
    public static class VentasPorVendedorDTO {
        private String vendedor;
        private String rol;
        private BigDecimal totalVentas;
        private long transacciones;
        private BigDecimal ticketPromedio;
    }
}
