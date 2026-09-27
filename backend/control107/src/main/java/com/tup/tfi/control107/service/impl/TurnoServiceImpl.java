package com.tup.tfi.control107.service.impl;

import com.tup.tfi.control107.dto.AmbulanciaDTO;
import com.tup.tfi.control107.dto.ResumenOperativoDTO;
import com.tup.tfi.control107.dto.TurnoDTO;
import com.tup.tfi.control107.dto.request.InsumoRequestDTO;
import com.tup.tfi.control107.dto.request.TurnoRequestDTO;
import com.tup.tfi.control107.model.entity.*;
import com.tup.tfi.control107.model.enums.EstadoTurno;
import com.tup.tfi.control107.repository.AmbulanciaRepository;
import com.tup.tfi.control107.repository.InsumoRepository;
import com.tup.tfi.control107.repository.TurnoRepository;
import com.tup.tfi.control107.repository.UsuarioRepository;
import com.tup.tfi.control107.service.TurnoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class TurnoServiceImpl extends AbstractService<Turno> implements TurnoService {

    private final TurnoRepository repository;
    private final AmbulanciaRepository ambulanciaRepository;
    private final InsumoRepository insumoRepository;
    private final UsuarioRepository usuarioRepository;

    public TurnoServiceImpl(TurnoRepository repository, AmbulanciaRepository ambulanciaRepository, InsumoRepository insumoRepository, UsuarioRepository usuarioRepository) {
        super(repository, Turno.class);
        this.repository = repository;
        this.ambulanciaRepository = ambulanciaRepository;
        this.insumoRepository = insumoRepository;
        this.usuarioRepository = usuarioRepository;
    }


    @Transactional(readOnly = true)
    @Override
    public ResumenOperativoDTO obtenerResumenOperativo() {
        var turnosActivos = repository.findByEstado(EstadoTurno.EN_CURSO);
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
    public TurnoDTO crearTurno(TurnoRequestDTO request) {
        Usuario admin = usuarioRepository.findById(request.getAdminId()).orElseThrow();
        Usuario enfermero = usuarioRepository.findById(request.getEnfermeroId()).orElseThrow();
        Ambulancia ambulancia = ambulanciaRepository.findById(request.getAmbulanciaId()).orElseThrow();
        Turno t = request.toTurno(admin, enfermero, ambulancia);
        repository.save(t);
        return new TurnoDTO(t);
    }

    @Transactional
    @Override
    public void registrarIngreso(Long turnoId, List<InsumoRequestDTO> insumos) {
        Turno t = obtener(turnoId);
        if (!EstadoTurno.PROGRAMADO.equals(t.getEstado())) {
            throw new IllegalArgumentException(String.format("No es posible registrar ingreso de turno %d con estado %s", turnoId, t.getEstado()));
        }
        var mapaControl = verificarInsumos(insumos, t);
        for (InsumoRequestDTO dto : insumos) {
            ControlInsumo control = mapaControl.get(dto.getId());
            control.informarIngreso(dto.getCantidad());
        }
        t.setEstado(EstadoTurno.EN_CURSO);
        t.setUpdatedAt(LocalDateTime.now());
        repository.save(t);
    }

    @Transactional
    @Override
    public void registrarEgreso(Long turnoId, List<InsumoRequestDTO> insumos) {
        Turno t = obtener(turnoId);
        if (!EstadoTurno.EN_CURSO.equals(t.getEstado())) {
            throw new IllegalArgumentException(String.format("No es posible registrar egreso de turno %d con estado %s", turnoId, t.getEstado()));
        }
        var mapaControl = verificarInsumos(insumos, t);
        for (InsumoRequestDTO dto : insumos) {
            ControlInsumo control = mapaControl.get(dto.getId());
            control.informarEgreso(dto.getCantidad());
        }
        t.setEstado(EstadoTurno.FINALIZADO);
        t.setUpdatedAt(LocalDateTime.now());
        repository.save(t);
    }

    @Override
    public List<TurnoDTO> obtenerTurnos() {
        return repository.findAll().stream().map(TurnoDTO::new).toList();
    }

    /**
     * Mapea los controles existentes del turno por id, extrae el conjunto de IDs recibidos por request
     * y valida que no contenga duplicados y coincidencia exacta con los IDs de control del Turno.
     *
     * @param insumos Lista de Ids de insumos y cantidades
     * @return Mapa de Ids de insumos a registros de control
     */
    private Map<Long, ControlInsumo> verificarInsumos(List<InsumoRequestDTO> insumos, Turno t) {
        if (null == insumos || insumos.isEmpty()) {
            throw new IllegalArgumentException("Lista de insumos para control de ingreso/egreso vacia o nula.");
        }
        Map<Long, ControlInsumo> mapaControl = t.getControlInsumos().stream()
                .collect(Collectors.toMap(c -> c.getInsumo().getId(), c -> c));
        Set<Long> idsRecibidos = insumos.stream()
                .map(InsumoRequestDTO::getId)
                .collect(Collectors.toSet());
        if (idsRecibidos.size() != insumos.size()) {
            throw new IllegalArgumentException("La lista enviada contiene insumos duplicados.");
        }
        if (!mapaControl.keySet().equals(idsRecibidos)) {
            throw new IllegalArgumentException("Los insumos enviados no coinciden con el control del Turno.");
        }
        return mapaControl;
    }

}
