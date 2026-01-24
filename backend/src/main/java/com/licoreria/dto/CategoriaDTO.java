package com.licoreria.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CategoriaDTO {

    private Long id;

    @NotBlank(message = "Nombre es requerido")
    @Size(max = 100)
    private String nombre;

    @Size(max = 1000)
    private String descripcion;

    private Boolean activa;
}
