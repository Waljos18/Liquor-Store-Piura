package com.licoreria.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UsuarioDTO {

    private Long id;

    @NotBlank(message = "Username es requerido")
    @Size(max = 50)
    private String username;

    @NotBlank(message = "Email es requerido")
    @Email
    @Size(max = 100)
    private String email;

    @Size(min = 6, max = 100)
    private String password; // opcional en update

    @NotBlank(message = "Nombre es requerido")
    @Size(max = 100)
    private String nombre;

    @NotBlank(message = "Rol es requerido")
    private String rol; // ADMIN, VENDEDOR

    private Boolean activo;
}
