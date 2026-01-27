package com.licoreria.dto.promocion;

import com.licoreria.dto.ProductoDTO;
import lombok.Data;

@Data
public class PromocionProductoDTO {

    private Long id;
    private ProductoDTO producto;
    private Integer cantidadMinima;
    private Integer cantidadGratis;
}
