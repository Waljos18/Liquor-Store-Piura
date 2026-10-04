package com.licoreria.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "pagos_cuenta")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PagoCuenta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cuenta_id", nullable = false)
    private CuentaPorCobrar cuenta;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal monto;

    @Column(nullable = false)
    @Builder.Default
    private Instant fecha = Instant.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Enumerated(EnumType.STRING)
    @Column(name = "forma_pago", length = 20, nullable = false)
    private FormaPago formaPago;

    @Column(columnDefinition = "TEXT")
    private String observaciones;

    public enum FormaPago {
        EFECTIVO, TARJETA, TRANSFERENCIA, YAPE, PLIN
    }
}
