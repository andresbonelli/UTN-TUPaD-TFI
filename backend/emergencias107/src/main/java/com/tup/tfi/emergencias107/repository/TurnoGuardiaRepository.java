package com.tup.tfi.emergencias107.repository;

import com.tup.tfi.emergencias107.model.TurnoGuardia;
import com.tup.tfi.emergencias107.model.enums.EstadoTurno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TurnoGuardiaRepository extends JpaRepository<TurnoGuardia, Long> {
    List<TurnoGuardia> findByEstado(EstadoTurno estado);
    List<TurnoGuardia> findByFecha(LocalDate fecha);
    List<TurnoGuardia> findByAmbulanciaId(Long ambulanciaId);
}
