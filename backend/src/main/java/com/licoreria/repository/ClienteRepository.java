package com.licoreria.repository;

import com.licoreria.entity.Cliente;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    Optional<Cliente> findByNumeroDocumento(String numeroDocumento);

    @Query("SELECT c FROM Cliente c WHERE " +
           "(:search IS NULL OR :search = '' OR LOWER(c.nombre) LIKE LOWER(CONCAT('%', :search, '%')) OR c.numeroDocumento = :search)")
    Page<Cliente> buscar(@Param("search") String search, Pageable pageable);

    boolean existsByNumeroDocumento(String numeroDocumento);
}
