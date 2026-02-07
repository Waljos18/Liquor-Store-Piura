package com.licoreria.repository;

import com.licoreria.entity.VentaPago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VentaPagoRepository extends JpaRepository<VentaPago, Long> {

    List<VentaPago> findByVentaId(Long ventaId);
}
