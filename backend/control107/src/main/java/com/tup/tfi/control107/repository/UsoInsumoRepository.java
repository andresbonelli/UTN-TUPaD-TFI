package com.tup.tfi.control107.repository;

import com.tup.tfi.control107.model.entity.UsoInsumo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UsoInsumoRepository extends JpaRepository<UsoInsumo, Long> {
    List<UsoInsumo> findByTurnoGuardiaId(Long turnoGuardiaId);
}
