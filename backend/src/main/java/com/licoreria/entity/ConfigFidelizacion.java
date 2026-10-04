package com.licoreria.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "config_fidelizacion")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConfigFidelizacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "soles_por_punto", nullable = false, precision = 10, scale = 2)
    private BigDecimal solesPorPunto;

    @Column(name = "puntos_por_sol_descuento", nullable = false, precision = 10, scale = 2)
    private BigDecimal puntosPorSolDescuento;

    @Column(name = "max_puntos_canje_por_venta", nullable = false)
    private Integer maxPuntosCanjeporVenta;

    @Column(name = "min_compra_para_canje", precision = 10, scale = 2)
    private BigDecimal minCompraParaCanje;

    @Column(nullable = false)
    private Boolean activo;

    @Column(name = "fecha_actualizacion")
    private Instant fechaActualizacion;

    @PreUpdate
    void preUpdate() {
        fechaActualizacion = Instant.now();
    }
}
