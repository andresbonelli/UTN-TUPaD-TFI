package com.tup.tfi.control107.repository;

import com.tup.tfi.control107.model.entity.RegistroIngreso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegistroIngresoRepository extends JpaRepository<RegistroIngreso, Long> {
    Optional<RegistroIngreso> findByTurnoId(Long turnoId);

    List<RegistroIngreso> findByInconsistenciasIsTrue();
}
