package com.tup.tfi.emergencias107.service;

import com.tup.tfi.emergencias107.dto.AmbulanciaDTO;
import com.tup.tfi.emergencias107.dto.InconsistenciaTicketDTO;
import com.tup.tfi.emergencias107.dto.ResumenOperativoDTO;
import com.tup.tfi.emergencias107.model.*;
import com.tup.tfi.emergencias107.model.enums.EstadoAmbulancia;
import com.tup.tfi.emergencias107.model.enums.EstadoTicket;
import com.tup.tfi.emergencias107.model.enums.EstadoTurno;
import com.tup.tfi.emergencias107.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public interface ControlGuardiaService {

    ResumenOperativoDTO obtenerResumenOperativo();

    ControlIngreso registrarControlIngreso(ControlIngreso controlIngreso);
}
