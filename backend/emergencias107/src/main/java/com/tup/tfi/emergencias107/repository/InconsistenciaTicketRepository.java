package com.tup.tfi.emergencias107.repository;

import com.tup.tfi.emergencias107.model.InconsistenciaTicket;
import com.tup.tfi.emergencias107.model.enums.EstadoTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InconsistenciaTicketRepository extends JpaRepository<InconsistenciaTicket, Long> {
    List<InconsistenciaTicket> findByEstado(EstadoTicket estado);
    long countByEstado(EstadoTicket estado);
}
