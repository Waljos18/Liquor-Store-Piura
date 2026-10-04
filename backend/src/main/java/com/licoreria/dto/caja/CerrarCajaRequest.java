package com.licoreria.dto.caja;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class CerrarCajaRequest {

    @NotNull @PositiveOrZero
    private BigDecimal montoReal;   // monto contado físicamente

    private String observacionesCierre;
}
