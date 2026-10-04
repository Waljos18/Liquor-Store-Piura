package com.licoreria.dto.inventario;

import com.licoreria.dto.ProductoDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlertasResumenDTO {

    /** Productos con stock igual o por debajo del mínimo */
    private List<ProductoDTO> stockBajo;

    /** Productos que vencen en los próximos 7 días */
    private List<ProductoDTO> proximosVencer;

    /** Últimos movimientos importantes de las últimas 48h */
    private List<MovimientoInventarioDTO> movimientosRecientes;

    /** Total de alertas críticas (stockBajo + proximosVencer) */
    private int totalAlertas;
}
