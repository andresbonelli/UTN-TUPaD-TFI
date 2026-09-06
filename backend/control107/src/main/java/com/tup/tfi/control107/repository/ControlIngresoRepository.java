package com.tup.tfi.control107.repository;

import com.tup.tfi.control107.model.entity.ControlIngreso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ControlIngresoRepository extends JpaRepository<ControlIngreso, Long> {
    Optional<ControlIngreso> findByTurnoGuardiaId(Long turnoGuardiaId);
}
