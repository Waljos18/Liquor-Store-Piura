package com.licoreria.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "comprobantes_electronicos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComprobanteElectronico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venta_id")
    private Venta venta;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_comprobante", nullable = false, length = 10)
    private TipoComprobante tipoComprobante;

    @Column(nullable = false, length = 10)
    private String serie;

    @Column(nullable = false, length = 20)
    private String numero;

    @Column(name = "xml_enviado", columnDefinition = "TEXT")
    private String xmlEnviado;

    @Column(name = "pdf_generado")
    private byte[] pdfGenerado;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_sunat", length = 20)
    @Builder.Default
    private EstadoSunat estadoSunat = EstadoSunat.PENDIENTE;

    @Column(name = "fecha_emision")
    private Instant fechaEmision;

    @Column(name = "fecha_envio")
    private Instant fechaEnvio;

    @Column(name = "fecha_actualizacion")
    private Instant fechaActualizacion;

    @PrePersist
    void prePersist() {
        Instant now = Instant.now();
        fechaEmision = now;
        fechaActualizacion = now;
    }

    @PreUpdate
    void preUpdate() {
        fechaActualizacion = Instant.now();
    }

    public enum TipoComprobante { BOLETA, FACTURA, NOTA_CREDITO, NOTA_DEBITO }
    public enum EstadoSunat { PENDIENTE, ACEPTADO, RECHAZADO, ERROR }
}
