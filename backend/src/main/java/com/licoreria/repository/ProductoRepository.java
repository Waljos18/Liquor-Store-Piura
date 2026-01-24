package com.licoreria.repository;

import com.licoreria.entity.Producto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    Optional<Producto> findByCodigoBarras(String codigoBarras);

    @Query("SELECT p FROM Producto p WHERE p.activo = true AND " +
           "(LOWER(p.nombre) LIKE LOWER(CONCAT('%', :q, '%')) OR p.codigoBarras = :q)")
    List<Producto> buscarParaPos(@Param("q") String q);

    @Query("SELECT p FROM Producto p WHERE " +
           "(:search IS NULL OR :search = '' OR LOWER(p.nombre) LIKE LOWER(CONCAT('%', :search, '%')) OR p.codigoBarras = :search) AND " +
           "(:categoriaId IS NULL OR p.categoria.id = :categoriaId) AND " +
           "(:activo IS NULL OR p.activo = :activo) AND " +
           "(:stockBajo IS NULL OR :stockBajo = false OR p.stockActual <= p.stockMinimo)")
    Page<Producto> buscarConFiltros(
            @Param("search") String search,
            @Param("categoriaId") Long categoriaId,
            @Param("activo") Boolean activo,
            @Param("stockBajo") Boolean stockBajo,
            Pageable pageable);

    boolean existsByCodigoBarras(String codigoBarras);
}
