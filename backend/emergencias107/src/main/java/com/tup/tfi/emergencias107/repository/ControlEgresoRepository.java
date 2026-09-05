package com.tup.tfi.emergencias107.repository;

import com.tup.tfi.emergencias107.model.ControlEgreso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ControlEgresoRepository extends JpaRepository<ControlEgreso, Long> {
    Optional<ControlEgreso> findByTurnoGuardiaId(Long turnoGuardiaId);
    Optional<ControlEgreso> findFirstByTurnoGuardiaAmbulanciaIdOrderByFechaHoraDesc(Long ambulanciaId);
}
