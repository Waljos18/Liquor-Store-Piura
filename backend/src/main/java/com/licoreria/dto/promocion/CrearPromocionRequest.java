package com.licoreria.dto.promocion;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class CrearPromocionRequest {

    @NotBlank(message = "Nombre es requerido")
    private String nombre;

    @NotNull(message = "Tipo de promoción es requerido")
    private String tipo; // DESCUENTO_PORCENTAJE, DESCUENTO_MONTO, CANTIDAD, CATEGORIA, VOLUMEN

    private BigDecimal descuentoPorcentaje;
    private BigDecimal descuentoMonto;

    @NotNull(message = "Fecha de inicio es requerida")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", shape = JsonFormat.Shape.STRING)
    private LocalDateTime fechaInicio;

    @NotNull(message = "Fecha de fin es requerida")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", shape = JsonFormat.Shape.STRING)
    private LocalDateTime fechaFin;

    @Valid
    private List<ProductoPromocionRequest> productos;

    @Data
    public static class ProductoPromocionRequest {
        @NotNull(message = "Producto ID es requerido")
        private Long productoId;

        private Integer cantidadMinima = 1;
        private Integer cantidadGratis = 0;
    }
}
