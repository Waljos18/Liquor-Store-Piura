package com.licoreria.repository;

import com.licoreria.entity.Promocion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PromocionRepository extends JpaRepository<Promocion, Long> {

    Page<Promocion> findByActivaTrue(Pageable pageable);

    @Query("SELECT p FROM Promocion p WHERE p.activa = true AND " +
           "p.fechaInicio <= :fechaActual AND p.fechaFin >= :fechaActual")
    List<Promocion> findPromocionesActivas(@Param("fechaActual") LocalDateTime fechaActual);

    @Query("SELECT p FROM Promocion p JOIN p.productos pp WHERE " +
           "pp.producto.id = :productoId AND p.activa = true AND " +
           "p.fechaInicio <= :fechaActual AND p.fechaFin >= :fechaActual")
    List<Promocion> findPromocionesActivasByProducto(
            @Param("productoId") Long productoId,
            @Param("fechaActual") LocalDateTime fechaActual
    );
}
