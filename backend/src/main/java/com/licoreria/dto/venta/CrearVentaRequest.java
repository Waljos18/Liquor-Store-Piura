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
    private String formaPago; // EFECTIVO, TARJETA, TRANSFERENCIA, YAPE, PLIN, MIXTO

    /** Monto recibido en efectivo (para EFECTIVO). Usado para calcular vuelto */
    private BigDecimal montoRecibido;

    /** Desglose de pagos para forma MIXTO. Suma debe igualar al total */
    private List<PagoMixto> pagosMixtos;

    private BigDecimal descuento;

    private String observaciones;

    /** Referencia de operación para YAPE/PLIN (opcional) */
    private String referencia;

    @Data
    public static class PagoMixto {
        private String metodo; // EFECTIVO, TARJETA, YAPE, PLIN, TRANSFERENCIA
        private BigDecimal monto;
        private String referencia;
    }

    @Data
    public static class ItemVenta {
        /** ID de producto (venta por unidades). Mutuamente excluyente con packId */
        private Long productoId;

        /** ID de pack (venta por pack completo). Mutuamente excluyente con productoId */
        private Long packId;

        /** Cantidad: unidades si productoId; número de packs si packId */
        @NotNull(message = "Cantidad es requerida")
        private Integer cantidad;

        /** Precio unitario (opcional para producto; para pack se usa precio del pack) */
        private BigDecimal precioUnitario;
    }
}
