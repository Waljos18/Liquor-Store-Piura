package com.licoreria.dto.gasto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class GastoDTO {

    private Long id;
    private String descripcion;
    private String categoria;
    private BigDecimal monto;
    private String fecha;       // yyyy-MM-dd
    private String comprobante;
    private String observaciones;
    private String usuario;     // nombre del usuario
    private String fechaCreacion;
}
