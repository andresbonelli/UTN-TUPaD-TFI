package com.tup.tfi.control107.service.impl;

import com.tup.tfi.control107.dto.AmbulanciaDTO;
import com.tup.tfi.control107.dto.ResumenOperativoDTO;
import com.tup.tfi.control107.dto.TurnoDTO;
import com.tup.tfi.control107.dto.request.IngresoEgresoDTO;
import com.tup.tfi.control107.dto.request.ControlInsumoRequestDTO;
import com.tup.tfi.control107.dto.request.TurnoRequestDTO;
import com.tup.tfi.control107.model.entity.*;
import com.tup.tfi.control107.model.enums.EstadoTurno;
import com.tup.tfi.control107.model.enums.HorarioTurno;
import com.tup.tfi.control107.model.enums.RolUsuario;
import com.tup.tfi.control107.repository.AmbulanciaRepository;
import com.tup.tfi.control107.repository.TurnoRepository;
import com.tup.tfi.control107.repository.UsuarioRepository;
import com.tup.tfi.control107.service.TurnoService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class TurnoServiceImpl extends AbstractService<Turno> implements TurnoService {

    private final TurnoRepository repository;
    private final AmbulanciaRepository ambulanciaRepository;
    private final UsuarioRepository usuarioRepository;

    private static final String OBSERVACIONES_CANCELADO = "Turno cancelado";

    public TurnoServiceImpl(TurnoRepository repository, AmbulanciaRepository ambulanciaRepository, UsuarioRepository usuarioRepository) {
        super(repository, Turno.class);
        this.repository = repository;
        this.ambulanciaRepository = ambulanciaRepository;
        this.usuarioRepository = usuarioRepository;
    }


    @Transactional(readOnly = true)
    @Override
    public ResumenOperativoDTO obtenerResumenOperativo() {
        var turnosActivos = obtenerActivos();
        var ambulancias = ambulanciaRepository.findAllByEliminadoIsFalse();

        return ResumenOperativoDTO.builder()
                .turnosActivos(turnosActivos.size())
                .ambulanciasDisponibles(ambulancias.stream().filter(Ambulancia::isDisponible).count())
                .ambulanciasTotales(ambulancias.size())
                .alertas(turnosActivos.stream()
                        .filter(t -> t.getControlInsumos().stream()
                                .anyMatch(i -> i.getIngresoFaltante() > 0 && i.getInsumo().isCritico()))
                        .count()
                )
                .turnosConInconsistencias(turnosActivos.stream()
                        .filter(t -> t.getControlInsumos().stream()
                                .anyMatch(i -> i.getIngresoFaltante() > 0))
                        .map(TurnoDTO::new).toList())
                .listaAmbulancias(ambulancias.stream().map(AmbulanciaDTO::new).toList())
                .build();
    }

    @Transactional
    @Override
    public TurnoDTO crearTurno(Long adminId, TurnoRequestDTO request) {
        Usuario admin = obtenerUsuario(adminId, RolUsuario.ADMINISTRADOR);
        Usuario enfermero = obtenerUsuario(request.getEnfermeroId(), RolUsuario.ENFERMERO);
        Ambulancia ambulancia = obtenerAmbulancia(request.getAmbulanciaId());
        validarDisponibilidad(request.getAmbulanciaId(), request.getEnfermeroId(), request.getFecha(), request.getHorario(), null);
        Turno t = request.toTurno(admin, enfermero, ambulancia);
        repository.save(t);
        return new TurnoDTO(t);
    }

    @Transactional
    @Override
    public void registrarIngreso(IngresoEgresoDTO request) {
        Turno t = obtener(request.getTurnoId());
        if (!EstadoTurno.PROGRAMADO.equals(t.getEstado())) {
            throw new IllegalArgumentException(
                    String.format("No es posible registrar ingreso de turno %d con estado %s",
                            request.getTurnoId(), t.getEstado()
                    ));
        }
        var mapaControl = verificarInsumos(request.getInsumos(), t);
        for (ControlInsumoRequestDTO dto : request.getInsumos()) {
            ControlInsumo control = mapaControl.get(dto.getId());
            control.informarIngreso(dto.getCantidad());
        }
        t.setObservacionesIngreso(request.getObservaciones());
        t.setEstado(EstadoTurno.EN_CURSO);
        t.setUpdatedAt(LocalDateTime.now());
        repository.save(t);
    }

    @Transactional
    @Override
    public void registrarEgreso(IngresoEgresoDTO request) {
        Turno t = obtener(request.getTurnoId());
        if (!EstadoTurno.EN_CURSO.equals(t.getEstado())) {
            throw new IllegalArgumentException(
                    String.format("No es posible registrar egreso de turno %d con estado %s",
                            request.getTurnoId(), t.getEstado()
                    ));
        }
        var mapaControl = verificarInsumos(request.getInsumos(), t);
        for (ControlInsumoRequestDTO dto : request.getInsumos()) {
            ControlInsumo control = mapaControl.get(dto.getId());
            control.informarEgreso(
                    dto.getCantidad(),
                    null != dto.getCantidadRestockeo() ? dto.getCantidadRestockeo() : 0
            );
        }
        t.setObservacionesEgreso(request.getObservaciones());
        t.setEstado(EstadoTurno.FINALIZADO);
        t.setUpdatedAt(LocalDateTime.now());
        repository.save(t);
    }

    @Override
    public List<TurnoDTO> obtenerTodos() {
        return repository.findAllByEliminadoIsFalse().stream().map(TurnoDTO::new).toList();
    }

    @Override
    public TurnoDTO obtenerPorId(Long id) {
        Turno t = obtener(id);
        return new TurnoDTO(t);
    }

    @Override
    public List<TurnoDTO> obtenerPorEnfermeroId(Long enfermeroId) {
        return repository.findAllByEnfermeroIdAndEliminadoIsFalseOrderByFechaDesc(enfermeroId).stream().map(TurnoDTO::new).toList();
    }

    @Override
    public List<TurnoDTO> obtenerTurnosActivos() {
        return obtenerActivos().stream().map(TurnoDTO::new).toList();
    }

    @Transactional
    @Override
    public TurnoDTO cancelarTurno(Long turnoId, String observaciones) {
        Turno t = obtener(turnoId);
        if (!EstadoTurno.PROGRAMADO.equals(t.getEstado())) {
            throw new IllegalArgumentException(
                    String.format("No es posible cancelar turno %d con estado %s",
                            turnoId, t.getEstado()
                    ));
        }
        t.setEstado(EstadoTurno.CANCELADO);
        t.setObservacionesEgreso(null != observaciones ? observaciones : OBSERVACIONES_CANCELADO);
        t.setUpdatedAt(LocalDateTime.now());
        repository.save(t);
        return new TurnoDTO(t);
    }

    @Transactional
    @Override
    public TurnoDTO modificarTurno(Long turnoId, TurnoRequestDTO request) {
        Turno t = obtener(turnoId);
        if (!EstadoTurno.PROGRAMADO.equals(t.getEstado())) {
            throw new IllegalArgumentException(
                    String.format("No es posible modificar turno %d con estado %s",
                            turnoId, t.getEstado()
                    ));
        }
        Ambulancia ambulancia = request.getAmbulanciaId() != null ? obtenerAmbulancia(request.getAmbulanciaId()) : null;
        Usuario enfermero = request.getEnfermeroId() != null ? obtenerUsuario(request.getEnfermeroId(), RolUsuario.ENFERMERO) : null;

        Long targetAmbulanciaId = null != ambulancia ? ambulancia.getId() : (null != t.getAmbulancia() ? t.getAmbulancia().getId() : null);
        Long targetEnfermeroId = null != enfermero ? enfermero.getId() : (null != t.getEnfermero() ? t.getEnfermero().getId() : null);
        LocalDate targetFecha = null != request.getFecha() ? request.getFecha() : t.getFecha();
        HorarioTurno targetHorario = null != request.getHorario() ? request.getHorario() : t.getHorario();

        validarDisponibilidad(targetAmbulanciaId, targetEnfermeroId, targetFecha, targetHorario, turnoId);

        request.aplicar(t, ambulancia, enfermero);
        repository.save(t);
        return new TurnoDTO(t);
    }

    private void validarDisponibilidad(Long ambulanciaId, Long enfermeroId, LocalDate fecha, com.tup.tfi.control107.model.enums.HorarioTurno horario, Long turnoIdExcluido) {
        if (null != ambulanciaId && null != fecha && null != horario) {
            boolean ocupada = (turnoIdExcluido == null)
                    ? repository.existsByAmbulanciaIdAndFechaAndHorarioAndEstadoNotAndEliminadoIsFalse(
                    ambulanciaId, fecha, horario, EstadoTurno.CANCELADO)
                    : repository.existsByAmbulanciaIdAndFechaAndHorarioAndEstadoNotAndEliminadoIsFalseAndIdNot(
                    ambulanciaId, fecha, horario, EstadoTurno.CANCELADO, turnoIdExcluido);

            if (ocupada) {
                throw new IllegalArgumentException("La ambulancia ya se encuentra asignada a un turno en la misma fecha y franja horaria.");
            }
        }

        if (null != enfermeroId && null != fecha && null != horario) {
            boolean ocupado = (turnoIdExcluido == null)
                    ? repository.existsByEnfermeroIdAndFechaAndHorarioAndEstadoNotAndEliminadoIsFalse(
                    enfermeroId, fecha, horario, EstadoTurno.CANCELADO)
                    : repository.existsByEnfermeroIdAndFechaAndHorarioAndEstadoNotAndEliminadoIsFalseAndIdNot(
                    enfermeroId, fecha, horario, EstadoTurno.CANCELADO, turnoIdExcluido);

            if (ocupado) {
                throw new IllegalArgumentException("El enfermero ya se encuentra asignado a un turno en la misma fecha y franja horaria.");
            }
        }
    }

    /**
     * Mapea los controles existentes del turno por id, extrae el conjunto de IDs recibidos por request
     * y valida que no contenga duplicados y coincidencia exacta con los IDs de control del Turno.
     *
     * @param insumos Lista de Ids de insumos y cantidades
     * @return Mapa de Ids de insumos a registros de control
     */
    private Map<Long, ControlInsumo> verificarInsumos(List<ControlInsumoRequestDTO> insumos, Turno t) {
        if (null == insumos || insumos.isEmpty()) {
            throw new IllegalArgumentException("Lista de insumos para control de ingreso/egreso vacia o nula.");
        }
        Map<Long, ControlInsumo> mapaControl = t.getControlInsumos().stream()
                .collect(Collectors.toMap(c -> c.getInsumo().getId(), c -> c));
        Set<Long> idsRecibidos = insumos.stream()
                .map(ControlInsumoRequestDTO::getId)
                .collect(Collectors.toSet());
        if (idsRecibidos.size() != insumos.size()) {
            throw new IllegalArgumentException("La lista enviada contiene insumos duplicados.");
        }
        if (!mapaControl.keySet().equals(idsRecibidos)) {
            throw new IllegalArgumentException("Los insumos enviados no coinciden con el control del Turno.");
        }
        return mapaControl;
    }

    private List<Turno> obtenerActivos() {
        return repository.findByEstadoAndEliminadoIsFalse(EstadoTurno.EN_CURSO);
    }

    private Ambulancia obtenerAmbulancia(Long ambulanciaId) {
        return ambulanciaRepository.findByIdAndEliminadoIsFalse(ambulanciaId).orElseThrow(
                () -> new EntityNotFoundException("Ambulancia no encontrada")
        );
    }

    private Usuario obtenerUsuario(Long usuarioId, RolUsuario rol) {
        Usuario encontrado = usuarioRepository.findByIdAndEliminadoIsFalse(usuarioId).orElseThrow(
                () -> new EntityNotFoundException("Usuario no encontrado")
        );
        if (!encontrado.getRol().equals(rol)) {
            throw new IllegalArgumentException("El usuario solicitado no tiene el rol {" + rol.name() + "}");
        }
        return encontrado;
    }

}
