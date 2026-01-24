package com.licoreria.repository;

import com.licoreria.entity.Compra;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface CompraRepository extends JpaRepository<Compra, Long> {

    Optional<Compra> findByNumeroCompra(String numeroCompra);

    Page<Compra> findByProveedorId(Long proveedorId, Pageable pageable);

    @Query("SELECT c FROM Compra c WHERE c.fechaCompra BETWEEN :fechaDesde AND :fechaHasta")
    Page<Compra> findByFechaCompraBetween(
            @Param("fechaDesde") LocalDate fechaDesde,
            @Param("fechaHasta") LocalDate fechaHasta,
            Pageable pageable
    );

    @Query("SELECT c FROM Compra c WHERE c.estado = :estado")
    Page<Compra> findByEstado(@Param("estado") Compra.Estado estado, Pageable pageable);
}
