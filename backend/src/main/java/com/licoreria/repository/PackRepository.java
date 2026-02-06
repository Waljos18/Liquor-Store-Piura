package com.licoreria.repository;

import com.licoreria.entity.Pack;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PackRepository extends JpaRepository<Pack, Long> {

    Page<Pack> findByActivoTrue(Pageable pageable);

    /** Packs que contienen el producto dado (para equivalencia stock → packs) */
    @Query("SELECT DISTINCT p FROM Pack p JOIN FETCH p.productos pp WHERE pp.producto.id = :productoId AND p.activo = true")
    List<Pack> findPacksContainingProducto(@Param("productoId") Long productoId);
}
