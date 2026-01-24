package com.licoreria.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ProductoDTO {

    private Long id;

    @Size(max = 50)
    private String codigoBarras;

    @NotBlank(message = "Nombre es requerido")
    @Size(max = 200)
    private String nombre;

    @Size(max = 100)
    private String marca;

    private Long categoriaId;
    private CategoriaDTO categoria;

    @DecimalMin("0")
    private BigDecimal precioCompra;

    @NotNull(message = "Precio de venta es requerido")
    @DecimalMin("0")
    private BigDecimal precioVenta;

    private Integer stockActual;
    private Integer stockInicial;
    private Integer stockMinimo;
    private Integer stockMaximo;

    private LocalDate fechaVencimiento;
    private String imagen;
    private Boolean activo;
}
