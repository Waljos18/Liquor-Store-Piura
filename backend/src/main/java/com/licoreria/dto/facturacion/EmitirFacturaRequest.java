package com.licoreria.dto.facturacion;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EmitirFacturaRequest {

    @NotNull(message = "ventaId es requerido")
    private Long ventaId;

    @NotBlank(message = "RUC es requerido")
    private String numeroDocumento; // RUC

    @NotBlank(message = "Razón social es requerida")
    private String razonSocial;
}
