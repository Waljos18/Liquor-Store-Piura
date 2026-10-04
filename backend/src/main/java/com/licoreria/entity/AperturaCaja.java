package com.licoreria.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "aperturas_caja")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AperturaCaja {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(name = "hora_apertura", nullable = false)
    private Instant horaApertura;

    @Column(name = "hora_cierre")
    private Instant horaCierre;

    @Column(name = "monto_inicial", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal montoInicial = BigDecimal.ZERO;

    @Column(name = "monto_cierre", precision = 10, scale = 2)
    private BigDecimal montoCierre;

    @Column(name = "monto_real", precision = 10, scale = 2)
    private BigDecimal montoReal;

    @Column(name = "sobrante_faltante", precision = 10, scale = 2)
    private BigDecimal sobranteFaltante;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_apertura_id", nullable = false)
    private Usuario usuarioApertura;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_cierre_id")
    private Usuario usuarioCierre;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    @Builder.Default
    private Estado estado = Estado.ABIERTA;

    @Column(columnDefinition = "TEXT")
    private String observaciones;

    @Column(name = "observaciones_cierre", columnDefinition = "TEXT")
    private String observacionesCierre;

    @Column(name = "fecha_creacion", updatable = false)
    private Instant fechaCreacion;

    @PrePersist
    void prePersist() {
        fechaCreacion = Instant.now();
        if (horaApertura == null) horaApertura = Instant.now();
        if (fecha == null) fecha = LocalDate.now();
    }

    public enum Estado {
        ABIERTA, CERRADA
    }
}
