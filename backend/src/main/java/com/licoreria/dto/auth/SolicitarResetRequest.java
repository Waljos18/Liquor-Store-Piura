package com.licoreria.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SolicitarResetRequest {

    @NotBlank(message = "El email es requerido")
    @Email(message = "Email inválido")
    private String email;
}
