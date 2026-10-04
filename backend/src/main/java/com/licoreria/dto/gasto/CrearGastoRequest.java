package com.licoreria.dto.gasto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CrearGastoRequest {

    @NotBlank
    private String descripcion;

    @NotBlank
    private String categoria;

    @NotNull
    private BigDecimal monto;

    @NotNull
    private LocalDate fecha;

    private String comprobante;

    private String observaciones;
}
