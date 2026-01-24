package com.licoreria.repository;

import com.licoreria.entity.Proveedor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProveedorRepository extends JpaRepository<Proveedor, Long> {

    Optional<Proveedor> findByRuc(String ruc);

    @Query("SELECT p FROM Proveedor p WHERE " +
           "LOWER(p.razonSocial) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.ruc) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Proveedor> buscar(@Param("search") String search, Pageable pageable);

    Page<Proveedor> findByActivoTrue(Pageable pageable);
}
