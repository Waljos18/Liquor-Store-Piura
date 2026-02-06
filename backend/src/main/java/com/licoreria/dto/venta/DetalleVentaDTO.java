package com.licoreria.dto.venta;

import com.licoreria.dto.ProductoDTO;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class DetalleVentaDTO {

    private Long id;
    /** Presente cuando la línea es por producto suelto */
    private ProductoDTO producto;
    /** ID y nombre del pack cuando la línea es venta de pack */
    private Long packId;
    private String packNombre;
    private Integer cantidad;
    private BigDecimal precioUnitario;
    private BigDecimal descuento;
    private BigDecimal subtotal;
}
