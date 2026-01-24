package com.licoreria.dto.compra;

import com.licoreria.dto.ProductoDTO;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class DetalleCompraDTO {

    private Long id;
    private ProductoDTO producto;
    private Integer cantidad;
    private BigDecimal precioUnitario;
    private BigDecimal subtotal;
}
