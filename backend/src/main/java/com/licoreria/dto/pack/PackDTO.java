package com.licoreria.dto.pack;

import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
public class PackDTO {

    private Long id;
    private String nombre;
    private BigDecimal precioPack;
    private Boolean activo;
    private Instant fechaCreacion;
    private List<PackProductoDTO> productos;
}
