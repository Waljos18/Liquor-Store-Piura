package com.licoreria.repository;

import com.licoreria.entity.PuntosMovimiento;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PuntosMovimientoRepository extends JpaRepository<PuntosMovimiento, Long> {
    Page<PuntosMovimiento> findByClienteIdOrderByFechaDesc(Long clienteId, Pageable pageable);
}
