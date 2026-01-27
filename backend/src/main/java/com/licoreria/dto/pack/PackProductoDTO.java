package com.licoreria.dto.pack;

import com.licoreria.dto.ProductoDTO;
import lombok.Data;

@Data
public class PackProductoDTO {

    private Long id;
    private ProductoDTO producto;
    private Integer cantidad;
}
