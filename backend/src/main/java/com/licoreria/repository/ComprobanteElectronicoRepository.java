package com.licoreria.repository;

import com.licoreria.entity.ComprobanteElectronico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ComprobanteElectronicoRepository extends JpaRepository<ComprobanteElectronico, Long> {

    Optional<ComprobanteElectronico> findByVentaId(Long ventaId);

    @Query(value = "SELECT COALESCE(MAX(CAST(numero AS INTEGER)), 0) + 1 FROM comprobantes_electronicos WHERE serie = :serie", nativeQuery = true)
    long siguienteNumeroPorSerie(@Param("serie") String serie);
}
