package com.licoreria.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "devoluciones")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DevolucionVenta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_devolucion", unique = true, length = 20)
    private String numeroDevolucion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venta_id")
    private Venta venta;

    @Column(nullable = false)
    private Instant fecha;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Enumerated(EnumType.STRING)
    @Column(length = 50, nullable = false)
    private Motivo motivo;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    @Builder.Default
    private Estado estado = Estado.COMPLETADA;

    @Column(columnDefinition = "TEXT")
    private String observaciones;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal total;

    @Column(name = "fecha_creacion", updatable = false)
    private Instant fechaCreacion;

    @OneToMany(mappedBy = "devolucion", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<DetalleDevolucion> detalles = new ArrayList<>();

    @PrePersist
    void prePersist() {
        fechaCreacion = Instant.now();
        if (fecha == null) fecha = Instant.now();
    }

    public enum Motivo {
        PRODUCTO_DEFECTUOSO, PRODUCTO_INCORRECTO, CAMBIO_PRODUCTO, OTRO
    }

    public enum Estado {
        COMPLETADA, ANULADA
    }
}
