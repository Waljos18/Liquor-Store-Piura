package com.licoreria.dto.devolucion;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class CrearDevolucionRequest {

    private Long ventaId;

    @NotNull(message = "El motivo es requerido")
    private String motivo;

    private String observaciones;

    @NotEmpty(message = "Debe incluir al menos un producto a devolver")
    private List<ItemDevolucion> items;

    @Data
    public static class ItemDevolucion {
        @NotNull
        private Long productoId;
        @NotNull
        private Integer cantidad;
        @NotNull
        private BigDecimal precioUnitario;
    }
}
