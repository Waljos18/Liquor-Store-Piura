package com.licoreria.dto.compra;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import java.util.List;

@Data
public class RecibirCompraRequest {

    /** Si es null se asume recepción completa de todos los ítems */
    private List<ItemRecepcion> items;

    private String observaciones;

    @Data
    public static class ItemRecepcion {
        private Long productoId;
        private Integer cantidadRecibida;
    }
}
