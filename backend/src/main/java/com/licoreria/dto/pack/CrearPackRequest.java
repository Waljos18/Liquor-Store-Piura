package com.licoreria.dto.pack;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class CrearPackRequest {

    @NotBlank(message = "Nombre es requerido")
    private String nombre;

    @NotNull(message = "Precio del pack es requerido")
    private BigDecimal precioPack;

    @NotEmpty(message = "El pack debe tener al menos un producto")
    @Valid
    private List<ProductoPackRequest> productos;

    @Data
    public static class ProductoPackRequest {
        @NotNull(message = "Producto ID es requerido")
        private Long productoId;

        @NotNull(message = "Cantidad es requerida")
        private Integer cantidad;
    }
}
