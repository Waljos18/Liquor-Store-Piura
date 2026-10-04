package com.licoreria.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "mermas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Merma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    @Column(nullable = false)
    private Integer cantidad;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private Motivo motivo;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "valor_perdida", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal valorPerdida = BigDecimal.ZERO;

    @Column(nullable = false)
    private Instant fecha;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(name = "fecha_creacion", updatable = false)
    private Instant fechaCreacion;

    @PrePersist
    void prePersist() {
        Instant now = Instant.now();
        fechaCreacion = now;
        if (fecha == null) fecha = now;
    }

    public enum Motivo {
        VENCIMIENTO, ROTURA, DETERIORO, ROBO, DIFERENCIA_INVENTARIO, OTRO
    }
}
