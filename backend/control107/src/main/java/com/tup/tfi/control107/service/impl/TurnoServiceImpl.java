package com.tup.tfi.control107.service.impl;

import com.tup.tfi.control107.dto.AmbulanciaDTO;
import com.tup.tfi.control107.dto.ResumenOperativoDTO;
import com.tup.tfi.control107.model.entity.*;
import com.tup.tfi.control107.model.enums.EstadoTurno;
import com.tup.tfi.control107.repository.AmbulanciaRepository;
import com.tup.tfi.control107.repository.InsumoRepository;
import com.tup.tfi.control107.repository.RegistroIngresoRepository;
import com.tup.tfi.control107.repository.TurnoRepository;
import com.tup.tfi.control107.service.TurnoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TurnoServiceImpl implements TurnoService {

    private final AmbulanciaRepository ambulanciaRepository;
    private final InsumoRepository insumoRepository;
    private final TurnoRepository turnoRepository;
    private final RegistroIngresoRepository registroIngresoRepository;


    @Transactional(readOnly = true)
    @Override
    public ResumenOperativoDTO obtenerResumenOperativo() {
        var turnosActivos = turnoRepository.findByEstado(EstadoTurno.EN_CURSO);
        var ambulancias = ambulanciaRepository.findAll();
        var ingresosInconsistentes = registroIngresoRepository.findByInconsistenciasIsTrue();

        return ResumenOperativoDTO.builder()
                .turnosActivos(turnosActivos.size())
                .ambulanciasDisponibles(ambulancias.stream().filter(Ambulancia::isDisponible).count())
                .ambulanciasTotales(ambulancias.size())
                .alertas(turnosActivos.stream()
                        .filter(t -> t.getAmbulancia().getInsumos().stream()
                                .anyMatch(i -> i.getInsumo().isEsCritico() && i.getStock() < i.getInsumo().getStockBase()))
                        .count()
                )
                .inconsistencias(ingresosInconsistentes.size())
                .listaAmbulancias(ambulancias.stream().map(AmbulanciaDTO::new).toList())
                .build();
    }

    @Transactional
    @Override
    public RegistroIngreso registrarIngreso(RegistroIngreso registroIngreso) {
        return null;
    }

    @Transactional
    @Override
    public void registrarEgreso(Turno turno) {
    }

}
