package com.licoreria.dto.promocion;

import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class PromocionDTO {

    private Long id;
    private String nombre;
    private String tipo; // DESCUENTO_PORCENTAJE, DESCUENTO_MONTO, CANTIDAD, CATEGORIA, VOLUMEN
    private BigDecimal descuentoPorcentaje;
    private BigDecimal descuentoMonto;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
    private Boolean activa;
    private Instant fechaCreacion;
    private List<PromocionProductoDTO> productos;
}
