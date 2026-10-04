package com.licoreria.repository;

import com.licoreria.entity.ConfigFidelizacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ConfigFidelizacionRepository extends JpaRepository<ConfigFidelizacion, Long> {
    Optional<ConfigFidelizacion> findFirstByOrderByIdAsc();
}
