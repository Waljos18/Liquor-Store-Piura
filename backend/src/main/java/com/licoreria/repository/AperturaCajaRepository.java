package com.licoreria.repository;

import com.licoreria.entity.AperturaCaja;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AperturaCajaRepository extends JpaRepository<AperturaCaja, Long> {

    Optional<AperturaCaja> findByFechaAndEstado(LocalDate fecha, AperturaCaja.Estado estado);

    List<AperturaCaja> findByFechaOrderByHoraAperturaDesc(LocalDate fecha);

    @Query("SELECT a FROM AperturaCaja a WHERE a.estado = 'ABIERTA' ORDER BY a.horaApertura DESC")
    Optional<AperturaCaja> findAbierta();

    @Query("SELECT a FROM AperturaCaja a WHERE a.fecha BETWEEN :desde AND :hasta ORDER BY a.fecha DESC, a.horaApertura DESC")
    List<AperturaCaja> findByFechaBetween(@Param("desde") LocalDate desde, @Param("hasta") LocalDate hasta);
}
