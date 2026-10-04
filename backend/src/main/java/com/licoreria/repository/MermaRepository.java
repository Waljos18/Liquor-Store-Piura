package com.licoreria.repository;

import com.licoreria.entity.Merma;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface MermaRepository extends JpaRepository<Merma, Long> {

    Page<Merma> findByFechaBetween(Instant desde, Instant hasta, Pageable pageable);

    List<Merma> findByProductoId(Long productoId);
}
