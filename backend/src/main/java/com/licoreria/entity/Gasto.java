package com.licoreria.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "gastos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Gasto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String descripcion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private Categoria categoria;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal monto;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(length = 100)
    private String comprobante;

    @Column(columnDefinition = "TEXT")
    private String observaciones;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(name = "fecha_creacion", updatable = false)
    private Instant fechaCreacion;

    @PrePersist
    void prePersist() {
        fechaCreacion = Instant.now();
        if (fecha == null) fecha = LocalDate.now();
    }

    public enum Categoria {
        SERVICIOS, ALQUILER, SUELDOS, MANTENIMIENTO, PROVEEDOR, OTROS
    }
}
