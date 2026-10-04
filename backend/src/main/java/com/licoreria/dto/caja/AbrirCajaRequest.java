package com.licoreria.dto.caja;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class AbrirCajaRequest {

    @NotNull @PositiveOrZero
    private BigDecimal montoInicial;

    private String observaciones;
}
