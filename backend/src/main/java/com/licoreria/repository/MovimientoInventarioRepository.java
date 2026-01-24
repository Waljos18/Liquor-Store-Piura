package com.licoreria.repository;

import com.licoreria.entity.MovimientoInventario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface MovimientoInventarioRepository extends JpaRepository<MovimientoInventario, Long> {

    Page<MovimientoInventario> findByProductoId(Long productoId, Pageable pageable);

    Page<MovimientoInventario> findByTipoMovimiento(MovimientoInventario.TipoMovimiento tipo, Pageable pageable);

    @Query("SELECT m FROM MovimientoInventario m WHERE m.fecha BETWEEN :fechaDesde AND :fechaHasta")
    Page<MovimientoInventario> findByFechaBetween(
            @Param("fechaDesde") Instant fechaDesde,
            @Param("fechaHasta") Instant fechaHasta,
            Pageable pageable
    );

    @Query("SELECT m FROM MovimientoInventario m WHERE m.producto.id = :productoId ORDER BY m.fecha DESC")
    List<MovimientoInventario> findHistorialByProductoId(@Param("productoId") Long productoId);
}
