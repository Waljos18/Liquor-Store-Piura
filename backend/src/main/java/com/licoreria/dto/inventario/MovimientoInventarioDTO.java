package com.licoreria.dto.inventario;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovimientoInventarioDTO {

    private Long id;
    private String tipoMovimiento;
    private Integer cantidad;
    private String motivo;
    private Instant fecha;
    private ProductoResumenDTO producto;
    private UsuarioResumenDTO usuario;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductoResumenDTO {
        private Long id;
        private String nombre;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UsuarioResumenDTO {
        private Long id;
        private String nombre;
        private String username;
    }
}
