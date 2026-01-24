package com.licoreria.repository;

import com.licoreria.entity.Venta;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Long> {

    @Query("SELECT v FROM Venta v LEFT JOIN FETCH v.detalles d LEFT JOIN FETCH d.producto WHERE v.id = :id")
    Optional<Venta> findByIdWithDetalles(@Param("id") Long id);

    Optional<Venta> findByNumeroVenta(String numeroVenta);

    Page<Venta> findByUsuarioId(Long usuarioId, Pageable pageable);

    Page<Venta> findByClienteId(Long clienteId, Pageable pageable);

    @Query("SELECT v FROM Venta v WHERE v.fecha BETWEEN :fechaDesde AND :fechaHasta")
    Page<Venta> findByFechaBetween(
            @Param("fechaDesde") Instant fechaDesde,
            @Param("fechaHasta") Instant fechaHasta,
            Pageable pageable
    );

    @Query("SELECT v FROM Venta v WHERE v.estado = :estado")
    Page<Venta> findByEstado(@Param("estado") Venta.Estado estado, Pageable pageable);
}
