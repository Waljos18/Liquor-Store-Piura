package com.licoreria.repository;

import com.licoreria.entity.MovimientoInventario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface MovimientoInventarioRepository extends JpaRepository<MovimientoInventario, Long>, JpaSpecificationExecutor<MovimientoInventario> {

    @Query("SELECT m FROM MovimientoInventario m WHERE m.producto.id = :productoId ORDER BY m.fecha DESC")
    List<MovimientoInventario> findHistorialByProductoId(@Param("productoId") Long productoId);

    @Query("""
            SELECT m FROM MovimientoInventario m
            JOIN FETCH m.producto p
            LEFT JOIN FETCH m.usuario
            WHERE m.fecha >= :desde
            ORDER BY m.fecha DESC
            """)
    List<MovimientoInventario> findRecientesDesdeFecha(@Param("desde") Instant desde, Pageable pageable);
}
