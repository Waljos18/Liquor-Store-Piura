package com.licoreria.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cuentas_por_cobrar")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CuentaPorCobrar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venta_id", unique = true)
    private Venta venta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @Column(name = "monto_total", nullable = false, precision = 10, scale = 2)
    private BigDecimal montoTotal;

    @Column(name = "monto_pagado", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal montoPagado = BigDecimal.ZERO;

    @Column(name = "saldo_pendiente", nullable = false, precision = 10, scale = 2)
    private BigDecimal saldoPendiente;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    @Builder.Default
    private Estado estado = Estado.PENDIENTE;

    @Column(name = "fecha_vencimiento")
    private LocalDate fechaVencimiento;

    @Column(columnDefinition = "TEXT")
    private String observaciones;

    @Column(name = "fecha_creacion", updatable = false)
    private Instant fechaCreacion;

    @Column(name = "fecha_actualizacion")
    private Instant fechaActualizacion;

    @OneToMany(mappedBy = "cuenta", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<PagoCuenta> pagos = new ArrayList<>();

    @PrePersist
    void prePersist() {
        fechaCreacion = Instant.now();
        fechaActualizacion = Instant.now();
    }

    @PreUpdate
    void preUpdate() {
        fechaActualizacion = Instant.now();
    }

    public enum Estado {
        PENDIENTE, PAGADO, VENCIDO
    }
}
