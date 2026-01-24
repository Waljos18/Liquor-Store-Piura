package com.licoreria.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.Instant;

@Data
public class ProveedorDTO {

    private Long id;

    @NotBlank(message = "Razón social es requerida")
    @Size(max = 200)
    private String razonSocial;

    @Size(max = 20)
    private String ruc;

    private String direccion;

    @Size(max = 20)
    private String telefono;

    @Size(max = 100)
    private String email;

    private Boolean activo;
    private Instant fechaCreacion;
}
