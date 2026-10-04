package com.licoreria.repository;

import com.licoreria.entity.DevolucionVenta;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface DevolucionRepository extends JpaRepository<DevolucionVenta, Long> {

    @Query("SELECT d FROM DevolucionVenta d WHERE d.venta.id = :ventaId")
    List<DevolucionVenta> findByVentaId(@Param("ventaId") Long ventaId);

    @Query("SELECT d FROM DevolucionVenta d WHERE d.fecha BETWEEN :desde AND :hasta ORDER BY d.fecha DESC")
    Page<DevolucionVenta> findByFechaBetween(
            @Param("desde") Instant desde,
            @Param("hasta") Instant hasta,
            Pageable pageable);
}
