package com.licoreria.dto.merma;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class MermaDTO {

    private Long id;
    private Long productoId;
    private String productoNombre;
    private Integer cantidad;
    private String motivo;
    private String descripcion;
    private BigDecimal valorPerdida;
    private String fecha;
    private String usuario;   // nombre del usuario
}
