package com.licoreria.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "promocion_productos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PromocionProducto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "promocion_id", nullable = false)
    private Promocion promocion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    @Column(name = "cantidad_minima")
    @Builder.Default
    private Integer cantidadMinima = 1;

    @Column(name = "cantidad_gratis")
    @Builder.Default
    private Integer cantidadGratis = 0;
}
