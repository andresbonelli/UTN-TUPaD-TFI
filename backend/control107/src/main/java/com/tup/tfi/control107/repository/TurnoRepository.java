package com.tup.tfi.control107.repository;

import com.tup.tfi.control107.model.entity.Turno;
import com.tup.tfi.control107.model.enums.EstadoTurno;
import com.tup.tfi.control107.model.enums.HorarioTurno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TurnoRepository extends JpaRepository<Turno, Long> {
    List<Turno> findByEstadoAndEliminadoIsFalse(EstadoTurno estado);
    List<Turno> findAllByEliminadoIsFalse();

    boolean existsByAmbulanciaIdAndFechaAndHorarioAndEstadoNotAndEliminadoIsFalse(
            Long ambulanciaId, LocalDate fecha, HorarioTurno horario, EstadoTurno estadoNot
    );

    boolean existsByAmbulanciaIdAndFechaAndHorarioAndEstadoNotAndEliminadoIsFalseAndIdNot(
            Long ambulanciaId, LocalDate fecha, HorarioTurno horario, EstadoTurno estadoNot, Long idNot
    );

    boolean existsByEnfermeroIdAndFechaAndHorarioAndEstadoNotAndEliminadoIsFalse(
            Long enfermeroId, LocalDate fecha, HorarioTurno horario, EstadoTurno estadoNot
    );

    boolean existsByEnfermeroIdAndFechaAndHorarioAndEstadoNotAndEliminadoIsFalseAndIdNot(
            Long enfermeroId, LocalDate fecha, HorarioTurno horario, EstadoTurno estadoNot, Long idNot
    );
}
