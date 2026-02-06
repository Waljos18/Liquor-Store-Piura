package com.licoreria.dto.inventario;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EntradaPackRequest {

    @NotNull(message = "El ID del pack es requerido")
    private Long packId;

    @NotNull(message = "La cantidad de packs es requerida")
    @Min(value = 1, message = "La cantidad debe ser al menos 1")
    private Integer cantidadPacks;
}
