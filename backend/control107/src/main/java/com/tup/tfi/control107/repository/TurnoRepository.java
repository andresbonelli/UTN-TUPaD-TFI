package com.tup.tfi.control107.repository;

import com.tup.tfi.control107.model.entity.Turno;
import com.tup.tfi.control107.model.enums.EstadoTurno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TurnoRepository extends JpaRepository<Turno, Long> {
    List<Turno> findByEstado(EstadoTurno estado);
    List<Turno> findByFecha(LocalDate fecha);
    List<Turno> findByAmbulanciaId(Long ambulanciaId);
}
