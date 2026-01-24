package com.licoreria.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ClienteDTO {

    private Long id;

    @NotNull(message = "Tipo de documento es requerido")
    private String tipoDocumento; // DNI, RUC, CE

    @NotBlank(message = "Número de documento es requerido")
    @Size(max = 20)
    private String numeroDocumento;

    @NotBlank(message = "Nombre es requerido")
    @Size(max = 200)
    private String nombre;

    @Size(max = 20)
    private String telefono;

    @Size(max = 100)
    private String email;

    private Integer puntosFidelizacion;
}
