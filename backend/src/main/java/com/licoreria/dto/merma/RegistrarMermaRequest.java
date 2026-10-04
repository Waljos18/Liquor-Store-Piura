package com.licoreria.dto.merma;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegistrarMermaRequest {

    @NotNull
    private Long productoId;

    @NotNull
    private Integer cantidad;

    @NotNull
    private String motivo;

    private String descripcion;
}
