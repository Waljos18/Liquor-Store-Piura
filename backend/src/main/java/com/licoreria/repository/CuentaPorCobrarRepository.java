package com.licoreria.repository;

import com.licoreria.entity.CuentaPorCobrar;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface CuentaPorCobrarRepository extends JpaRepository<CuentaPorCobrar, Long> {

    Optional<CuentaPorCobrar> findByVentaId(Long ventaId);

    Page<CuentaPorCobrar> findByClienteId(Long clienteId, Pageable pageable);

    Page<CuentaPorCobrar> findByEstado(CuentaPorCobrar.Estado estado, Pageable pageable);

    List<CuentaPorCobrar> findByClienteIdAndEstadoNot(Long clienteId, CuentaPorCobrar.Estado estado);

    @Query("SELECT COALESCE(SUM(c.saldoPendiente), 0) FROM CuentaPorCobrar c WHERE c.cliente.id = :clienteId AND c.estado != 'PAGADO'")
    BigDecimal sumSaldoPendienteByClienteId(@Param("clienteId") Long clienteId);
}
