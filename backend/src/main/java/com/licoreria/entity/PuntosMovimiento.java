package com.licoreria.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "puntos_movimientos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PuntosMovimiento {

    public enum Tipo {
        ACUMULACION,
        CANJE,
        AJUSTE_MANUAL
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private Tipo tipo;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(name = "saldo_despues", nullable = false)
    private Integer saldoDespues;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venta_id", nullable = true)
    private Venta venta;

    @Column(length = 200)
    private String motivo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = true)
    private Usuario usuario;

    @Column(nullable = false)
    @Builder.Default
    private Instant fecha = Instant.now();
}
