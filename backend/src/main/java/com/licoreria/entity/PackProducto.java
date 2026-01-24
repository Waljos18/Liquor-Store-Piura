package com.licoreria.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pack_productos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PackProducto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pack_id", nullable = false)
    private Pack pack;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    @Column(nullable = false)
    private Integer cantidad;
}
