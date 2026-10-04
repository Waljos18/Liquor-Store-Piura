package com.licoreria.repository;

import com.licoreria.entity.Gasto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface GastoRepository extends JpaRepository<Gasto, Long> {

    Page<Gasto> findByFechaBetween(LocalDate desde, LocalDate hasta, Pageable pageable);

    List<Gasto> findByFechaBetween(LocalDate desde, LocalDate hasta);

    @Query("SELECT SUM(g.monto) FROM Gasto g WHERE g.fecha BETWEEN :desde AND :hasta")
    BigDecimal sumMontoByFechaBetween(@Param("desde") LocalDate desde, @Param("hasta") LocalDate hasta);
}
