package com.licoreria.dto.cuenta;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class PagarCuentaRequest {

    @NotNull @Positive
    private BigDecimal monto;

    @NotNull
    private String formaPago;

    private String observaciones;
}
