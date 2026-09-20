package com.tup.tfi.control107.service.impl;

import com.tup.tfi.control107.dto.AmbulanciaDTO;
import com.tup.tfi.control107.dto.ResumenOperativoDTO;
import com.tup.tfi.control107.dto.TurnoDTO;
import com.tup.tfi.control107.model.entity.*;
import com.tup.tfi.control107.model.enums.EstadoTurno;
import com.tup.tfi.control107.repository.AmbulanciaRepository;
import com.tup.tfi.control107.repository.InsumoRepository;
import com.tup.tfi.control107.repository.TurnoRepository;
import com.tup.tfi.control107.service.TurnoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TurnoServiceImpl implements TurnoService {

    private final AmbulanciaRepository ambulanciaRepository;
    private final InsumoRepository insumoRepository;
    private final TurnoRepository turnoRepository;


    @Transactional(readOnly = true)
    @Override
    public ResumenOperativoDTO obtenerResumenOperativo() {
        var turnosActivos = turnoRepository.findByEstado(EstadoTurno.EN_CURSO);
        var ambulancias = ambulanciaRepository.findAll();

        return ResumenOperativoDTO.builder()
                .turnosActivos(turnosActivos.size())
                .ambulanciasDisponibles(ambulancias.stream().filter(Ambulancia::isDisponible).count())
                .ambulanciasTotales(ambulancias.size())
                .alertas(turnosActivos.stream()
                        .filter(t -> t.getControlInsumos().stream()
                                .anyMatch(i -> i.getIngresoFaltante() > 0 && i.getInsumo().isCritico()))
                        .count()
                )
                .inconsistencias(turnosActivos.stream()
                        .flatMap(t -> t.getControlInsumos().stream())
                        .filter(i -> i.getIngresoFaltante() > 0)
                        .count()
                )
                .listaAmbulancias(ambulancias.stream().map(AmbulanciaDTO::new).toList())
                .build();
    }

    @Transactional
    @Override
    public void registrarIngreso(Turno turno) {
    }

    @Transactional
    @Override
    public void registrarEgreso(Turno turno) {
    }

    @Override
    public List<TurnoDTO> obtenerTurnos() {
        return turnoRepository.findAll().stream().map(TurnoDTO::new).toList();
    }

}
