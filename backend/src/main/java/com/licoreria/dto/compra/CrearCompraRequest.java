package com.licoreria.dto.compra;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class CrearCompraRequest {

    @NotNull(message = "Proveedor ID es requerido")
    private Long proveedorId;

    private LocalDate fechaCompra;

    @NotEmpty(message = "La compra debe tener al menos un item")
    @Valid
    private List<ItemCompra> items;

    private String observaciones;

    @Data
    public static class ItemCompra {
        @NotNull(message = "Producto ID es requerido")
        private Long productoId;

        @NotNull(message = "Cantidad es requerida")
        private Integer cantidad;

        @NotNull(message = "Precio unitario es requerido")
        private java.math.BigDecimal precioUnitario;
    }
}
