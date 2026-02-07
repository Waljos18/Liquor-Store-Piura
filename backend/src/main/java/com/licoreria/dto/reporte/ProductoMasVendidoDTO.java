package com.licoreria.dto.reporte;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductoMasVendidoDTO {

    private Long productoId;
    private String nombreProducto;
    private long cantidadVendida;
    private BigDecimal totalVentas;
    private BigDecimal porcentajeDelTotal;
}
