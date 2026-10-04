package com.licoreria.dto.venta;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class CierreCajaDTO {

    private LocalDate fecha;
    private BigDecimal totalVentas;
    private BigDecimal totalGanancias;
    private long totalTransacciones;
    private long ventasAnuladas;
    private List<DesglosePagoDTO> desglosePorFormaPago;

    @Data
    public static class DesglosePagoDTO {
        private String formaPago;
        private BigDecimal total;
        private long cantidad;
    }

    private List<DesgloseVendedorDTO> ventasPorVendedor;

    @Data
    public static class DesgloseVendedorDTO {
        private String vendedor;
        private String rol;
        private BigDecimal totalVentas;
        private long transacciones;
    }
}
