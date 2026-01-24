package com.licoreria.dto.facturacion;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EmitirBoletaRequest {

    @NotNull(message = "ventaId es requerido")
    private Long ventaId;

    @NotBlank(message = "Tipo de documento del cliente es requerido")
    private String tipoDocumento; // DNI, CE

    @NotBlank(message = "Número de documento es requerido")
    private String numeroDocumento;

    @NotBlank(message = "Nombre del cliente es requerido")
    private String nombre;
}
