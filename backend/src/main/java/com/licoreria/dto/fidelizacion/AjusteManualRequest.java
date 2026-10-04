package com.licoreria.dto.fidelizacion;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AjusteManualRequest {
    @NotNull
    private Long clienteId;
    @NotNull
    private Integer cantidad;
    private String motivo;
}
