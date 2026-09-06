package com.tup.tfi.control107.service.impl;

import com.tup.tfi.control107.dto.AmbulanciaDTO;
import com.tup.tfi.control107.dto.InconsistenciaTicketDTO;
import com.tup.tfi.control107.dto.ResumenOperativoDTO;
import com.tup.tfi.control107.model.entity.*;
import com.tup.tfi.control107.model.enums.EstadoAmbulancia;
import com.tup.tfi.control107.model.enums.EstadoTicket;
import com.tup.tfi.control107.model.enums.EstadoTurno;
import com.tup.tfi.control107.repository.*;
import com.tup.tfi.control107.service.ControlGuardiaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ControlGuardiaServiceImpl implements ControlGuardiaService {

    private final TurnoGuardiaRepository turnoGuardiaRepository;
    private final AmbulanciaRepository ambulanciaRepository;
    private final ControlIngresoRepository controlIngresoRepository;
    private final ControlEgresoRepository controlEgresoRepository;
    private final InconsistenciaTicketRepository inconsistenciaTicketRepository;

    @Transactional(readOnly = true)
    @Override
    public ResumenOperativoDTO obtenerResumenOperativo() {
        long turnosActivos = turnoGuardiaRepository.findByEstado(EstadoTurno.EN_CURSO).size();
        
        long totalAmbulancias = ambulanciaRepository.count();
        long aptas = ambulanciaRepository.findByEstado(EstadoAmbulancia.APTA).size();

        long alertasPendientes = inconsistenciaTicketRepository.countByEstado(EstadoTicket.PENDIENTE);
        long controlesIncompletos = turnoGuardiaRepository.findByEstado(EstadoTurno.PROGRAMADO).size();

        List<AmbulanciaDTO> ambulanciasDTO = ambulanciaRepository.findAll().stream()
                .map(AmbulanciaDTO::new)
                .collect(Collectors.toList());

        List<InconsistenciaTicketDTO> alertasDTO = inconsistenciaTicketRepository.findByEstado(EstadoTicket.PENDIENTE).stream()
                .filter(Objects::nonNull)
                .sorted(Comparator.comparing(InconsistenciaTicket::getFechaHoraDeteccion, Comparator.reverseOrder()))
                .map(InconsistenciaTicketDTO::new)
                .collect(Collectors.toList());

        return ResumenOperativoDTO.builder()
                .turnosActivos(turnosActivos)
                .ambulanciasDisponibles(aptas)
                .ambulanciasTotales(totalAmbulancias)
                .alertasPendientes(alertasPendientes)
                .controlesIncompletos(controlesIncompletos)
                .listaAmbulancias(ambulanciasDTO)
                .alertasPrioritarias(alertasDTO)
                .build();
    }

    @Transactional
    @Override
    public ControlIngreso registrarControlIngreso(ControlIngreso controlIngreso) {
        controlIngreso.setFechaHora(LocalDateTime.now());
        ControlIngreso guardado = controlIngresoRepository.save(controlIngreso);

        TurnoGuardia turnoActual = guardado.getTurnoGuardia();
        Long ambulanciaId = turnoActual.getAmbulancia().getId();

        Optional<ControlEgreso> egresoAnteriorOpt = controlEgresoRepository
                .findFirstByTurnoGuardiaAmbulanciaIdOrderByFechaHoraDesc(ambulanciaId);

        if (egresoAnteriorOpt.isPresent()) {
            ControlEgreso egresoAnterior = egresoAnteriorOpt.get();
            
            for (DetalleStockIngreso detalleIngreso : guardado.getDetalles()) {
                Insumo insumo = detalleIngreso.getInsumo();
                
                Optional<DetalleStockEgreso> detalleEgresoOpt = egresoAnterior.getDetalles().stream()
                        .filter(d -> d.getInsumo().getId().equals(insumo.getId()))
                        .findFirst();

                if (detalleEgresoOpt.isPresent()) {
                    int dejada = detalleEgresoOpt.get().getCantidadDejada();
                    int recibida = detalleIngreso.getCantidadRecibida();

                    if (dejada != recibida) {
                        InconsistenciaTicket ticket = InconsistenciaTicket.builder()
                                .fechaHoraDeteccion(LocalDateTime.now())
                                .controlIngreso(guardado)
                                .controlEgresoAnterior(egresoAnterior)
                                .insumo(insumo)
                                .cantidadDejadaAnterior(dejada)
                                .cantidadRecibidaActual(recibida)
                                .diferencia(recibida - dejada)
                                .estado(EstadoTicket.PENDIENTE)
                                .observacionesAdmin("Inconsistencia generada automáticamente por discrepancia entre turnos.")
                                .build();

                        inconsistenciaTicketRepository.save(ticket);
                    }
                }
            }
        }

        return guardado;
    }

}
