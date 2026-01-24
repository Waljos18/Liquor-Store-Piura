package com.licoreria.dto.venta;

import com.licoreria.dto.ProductoDTO;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class DetalleVentaDTO {

    private Long id;
    private ProductoDTO producto;
    private Integer cantidad;
    private BigDecimal precioUnitario;
    private BigDecimal descuento;
    private BigDecimal subtotal;
}
