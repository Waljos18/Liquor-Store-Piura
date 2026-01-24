package com.licoreria.dto.venta;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class CrearVentaRequest {

    private Long clienteId;

    @NotEmpty(message = "La venta debe tener al menos un item")
    @Valid
    private List<ItemVenta> items;

    @NotNull(message = "Forma de pago es requerida")
    private String formaPago; // EFECTIVO, TARJETA, TRANSFERENCIA, MIXTO

    private BigDecimal descuento;

    private String observaciones;

    @Data
    public static class ItemVenta {
        @NotNull(message = "Producto ID es requerido")
        private Long productoId;

        @NotNull(message = "Cantidad es requerida")
        private Integer cantidad;

        private BigDecimal precioUnitario; // Opcional, se toma del producto si no se especifica
    }
}
