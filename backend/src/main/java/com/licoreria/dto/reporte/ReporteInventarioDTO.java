package com.licoreria.dto.reporte;

import com.licoreria.dto.ProductoDTO;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ReporteInventarioDTO {

    private BigDecimal valorTotalInventario;
    private long productosActivos;
    private long productosStockBajo;
    private long productosProximosVencer;
    private List<ProductoDTO> stockBajo;
    private List<ProductoDTO> proximosVencer;
}
