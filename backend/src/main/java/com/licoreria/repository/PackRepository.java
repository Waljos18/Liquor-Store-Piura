package com.licoreria.repository;

import com.licoreria.entity.Pack;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PackRepository extends JpaRepository<Pack, Long> {

    Page<Pack> findByActivoTrue(Pageable pageable);
}
