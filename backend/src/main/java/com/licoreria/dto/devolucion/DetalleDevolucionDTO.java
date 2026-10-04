package com.licoreria.dto.devolucion;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class DetalleDevolucionDTO {
    private Long id;
    private Long productoId;
    private String productoNombre;
    private Integer cantidad;
    private BigDecimal precioUnitario;
    private BigDecimal subtotal;
}
