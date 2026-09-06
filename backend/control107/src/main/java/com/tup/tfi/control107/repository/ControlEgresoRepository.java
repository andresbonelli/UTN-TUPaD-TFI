package com.tup.tfi.control107.repository;

import com.tup.tfi.control107.model.entity.ControlEgreso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ControlEgresoRepository extends JpaRepository<ControlEgreso, Long> {
    Optional<ControlEgreso> findByTurnoGuardiaId(Long turnoGuardiaId);
    Optional<ControlEgreso> findFirstByTurnoGuardiaAmbulanciaIdOrderByFechaHoraDesc(Long ambulanciaId);
}
