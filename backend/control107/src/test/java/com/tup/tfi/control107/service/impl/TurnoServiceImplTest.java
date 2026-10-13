package com.tup.tfi.control107.service.impl;

import com.tup.tfi.control107.dto.ResumenOperativoDTO;
import com.tup.tfi.control107.dto.TurnoDTO;
import com.tup.tfi.control107.dto.request.ControlInsumoRequestDTO;
import com.tup.tfi.control107.dto.request.IngresoEgresoDTO;
import com.tup.tfi.control107.dto.request.TurnoRequestDTO;
import com.tup.tfi.control107.model.entity.*;
import com.tup.tfi.control107.model.enums.EstadoTurno;
import com.tup.tfi.control107.model.enums.HorarioTurno;
import com.tup.tfi.control107.model.enums.RolUsuario;
import com.tup.tfi.control107.repository.AmbulanciaRepository;
import com.tup.tfi.control107.repository.TurnoRepository;
import com.tup.tfi.control107.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TurnoServiceImplTest {

    @Mock
    private TurnoRepository repository;

    @Mock
    private AmbulanciaRepository ambulanciaRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private TurnoServiceImpl turnoService;

    private Usuario admin;
    private Usuario enfermero;
    private Ambulancia ambulancia;
    private Insumo insumoCritico;
    private Insumo insumoNormal;
    private Turno turno;
    private ControlInsumo controlCritico;
    private ControlInsumo controlNormal;
    private TurnoRequestDTO turnoRequestDTO;

    private static final Long ADMIN_ID = 1L;
    private static final Long ENFERMERO_ID = 2L;
    private static final Long AMBULANCIA_ID = 5L;

    @BeforeEach
    void setUp() {
        admin = Usuario.builder()
                .nombre("Admin Test")
                .dni("11111111")
                .email("admin@test.com")
                .rol(RolUsuario.ADMINISTRADOR)
                .activo(true)
                .build();
        admin.setId(ADMIN_ID);

        enfermero = Usuario.builder()
                .nombre("Enfermero Test")
                .dni("22222222")
                .email("enfermero@test.com")
                .rol(RolUsuario.ENFERMERO)
                .activo(true)
                .build();
        enfermero.setId(ENFERMERO_ID);

        CategoriaInsumo categoria = CategoriaInsumo.builder()
                .nombre("MEDICACION")
                .color("#FF0000")
                .build();
        categoria.setId(10L);

        insumoCritico = Insumo.builder()
                .nombre("Oxigeno")
                .categoria(categoria)
                .puntoControl(50)
                .critico(true)
                .build();
        insumoCritico.setId(100L);

        insumoNormal = Insumo.builder()
                .nombre("Gasa")
                .categoria(categoria)
                .puntoControl(10)
                .critico(false)
                .build();
        insumoNormal.setId(101L);

        ambulancia = Ambulancia.builder()
                .patente("AE107AB")
                .disponible(true)
                .insumos(Set.of(insumoCritico, insumoNormal))
                .build();
        ambulancia.setId(AMBULANCIA_ID);

        turno = Turno.builder()
                .fecha(LocalDate.now())
                .horario(HorarioTurno.MANIANA)
                .estado(EstadoTurno.PROGRAMADO)
                .ambulancia(ambulancia)
                .admin(admin)
                .enfermero(enfermero)
                .nombreChofer("Chofer Test")
                .nombreMedico("Medico Test")
                .controlInsumos(new ArrayList<>())
                .build();
        turno.setId(20L);

        controlCritico = ControlInsumo.builder()
                .insumo(insumoCritico)
                .turno(turno)
                .cantidadIngreso(40)
                .ingresoFaltante(10)
                .cantidadRestockeo(0)
                .build();
        controlCritico.setId(200L);

        controlNormal = ControlInsumo.builder()
                .insumo(insumoNormal)
                .turno(turno)
                .cantidadIngreso(10)
                .ingresoFaltante(0)
                .cantidadRestockeo(0)
                .build();
        controlNormal.setId(201L);

        turno.getControlInsumos().add(controlCritico);
        turno.getControlInsumos().add(controlNormal);

        turnoRequestDTO = new TurnoRequestDTO(
                LocalDate.now(),
                HorarioTurno.MANIANA,
                ENFERMERO_ID,
                AMBULANCIA_ID,
                "Chofer Test",
                "Medico Test"
        );
    }

    @Test
    void obtenerResumenOperativo_ok() {
        turno.setEstado(EstadoTurno.EN_CURSO);
        when(repository.findByEstadoAndEliminadoIsFalse(EstadoTurno.EN_CURSO)).thenReturn(List.of(turno));
        when(ambulanciaRepository.findAllByEliminadoIsFalse()).thenReturn(List.of(ambulancia));

        ResumenOperativoDTO resumen = turnoService.obtenerResumenOperativo();

        assertNotNull(resumen);
        assertEquals(1, resumen.getTurnosActivos());
        assertEquals(1, resumen.getAmbulanciasDisponibles());
        assertEquals(1, resumen.getAmbulanciasTotales());
        assertEquals(1, resumen.getAlertas());
        assertEquals(1, resumen.getInconsistencias());
        assertEquals(1, resumen.getListaAmbulancias().size());
        verify(repository, times(1)).findByEstadoAndEliminadoIsFalse(EstadoTurno.EN_CURSO);
        verify(ambulanciaRepository, times(1)).findAllByEliminadoIsFalse();
    }

    @Test
    void crearTurno_ok() {
        when(usuarioRepository.findByIdAndEliminadoIsFalse(1L)).thenReturn(Optional.of(admin));
        when(usuarioRepository.findByIdAndEliminadoIsFalse(2L)).thenReturn(Optional.of(enfermero));
        when(ambulanciaRepository.findByIdAndEliminadoIsFalse(5L)).thenReturn(Optional.of(ambulancia));
        when(repository.save(any(Turno.class))).thenReturn(turno);

        TurnoDTO resultado = turnoService.crearTurno(ADMIN_ID,turnoRequestDTO);

        assertNotNull(resultado);
        assertEquals(EstadoTurno.PROGRAMADO, resultado.getEstado());
        verify(usuarioRepository, times(1)).findByIdAndEliminadoIsFalse(1L);
        verify(usuarioRepository, times(1)).findByIdAndEliminadoIsFalse(2L);
        verify(ambulanciaRepository, times(1)).findByIdAndEliminadoIsFalse(5L);
        verify(repository, times(1)).save(any(Turno.class));
    }

    @Test
    void crearTurno_errorAdminNoEncontrado() {
        when(usuarioRepository.findByIdAndEliminadoIsFalse(1L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> turnoService.crearTurno(ADMIN_ID,turnoRequestDTO));
        verify(usuarioRepository, times(1)).findByIdAndEliminadoIsFalse(1L);
        verify(repository, never()).save(any(Turno.class));
    }

    @Test
    void crearTurno_errorEnfermeroNoEncontrado() {
        when(usuarioRepository.findByIdAndEliminadoIsFalse(1L)).thenReturn(Optional.of(admin));
        when(usuarioRepository.findByIdAndEliminadoIsFalse(2L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> turnoService.crearTurno(ADMIN_ID,turnoRequestDTO));
        verify(usuarioRepository, times(1)).findByIdAndEliminadoIsFalse(1L);
        verify(usuarioRepository, times(1)).findByIdAndEliminadoIsFalse(2L);
        verify(repository, never()).save(any(Turno.class));
    }

    @Test
    void crearTurno_errorAmbulanciaNoEncontrada() {
        when(usuarioRepository.findByIdAndEliminadoIsFalse(1L)).thenReturn(Optional.of(admin));
        when(usuarioRepository.findByIdAndEliminadoIsFalse(2L)).thenReturn(Optional.of(enfermero));
        when(ambulanciaRepository.findByIdAndEliminadoIsFalse(5L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> turnoService.crearTurno(ADMIN_ID,turnoRequestDTO));
        verify(usuarioRepository, times(1)).findByIdAndEliminadoIsFalse(1L);
        verify(usuarioRepository, times(1)).findByIdAndEliminadoIsFalse(2L);
        verify(ambulanciaRepository, times(1)).findByIdAndEliminadoIsFalse(5L);
        verify(repository, never()).save(any(Turno.class));
    }

    @Test
    void crearTurno_errorAmbulanciaOcupada() {
        when(usuarioRepository.findByIdAndEliminadoIsFalse(1L)).thenReturn(Optional.of(admin));
        when(usuarioRepository.findByIdAndEliminadoIsFalse(2L)).thenReturn(Optional.of(enfermero));
        when(ambulanciaRepository.findByIdAndEliminadoIsFalse(5L)).thenReturn(Optional.of(ambulancia));
        when(repository.existsByAmbulanciaIdAndFechaAndHorarioAndEstadoNotAndEliminadoIsFalse(
                eq(5L), any(LocalDate.class), any(HorarioTurno.class), eq(EstadoTurno.CANCELADO)
        )).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> turnoService.crearTurno(ADMIN_ID,turnoRequestDTO));
        verify(repository, never()).save(any(Turno.class));
    }

    @Test
    void crearTurno_errorEnfermeroOcupado() {
        when(usuarioRepository.findByIdAndEliminadoIsFalse(1L)).thenReturn(Optional.of(admin));
        when(usuarioRepository.findByIdAndEliminadoIsFalse(2L)).thenReturn(Optional.of(enfermero));
        when(ambulanciaRepository.findByIdAndEliminadoIsFalse(5L)).thenReturn(Optional.of(ambulancia));
        when(repository.existsByAmbulanciaIdAndFechaAndHorarioAndEstadoNotAndEliminadoIsFalse(
                eq(5L), any(LocalDate.class), any(HorarioTurno.class), eq(EstadoTurno.CANCELADO)
        )).thenReturn(false);
        when(repository.existsByEnfermeroIdAndFechaAndHorarioAndEstadoNotAndEliminadoIsFalse(
                eq(2L), any(LocalDate.class), any(HorarioTurno.class), eq(EstadoTurno.CANCELADO)
        )).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> turnoService.crearTurno(ADMIN_ID,turnoRequestDTO));
        verify(repository, never()).save(any(Turno.class));
    }

    @Test
    void registrarIngreso_ok() {
        when(repository.findById(20L)).thenReturn(Optional.of(turno));
        when(repository.save(any(Turno.class))).thenReturn(turno);

        IngresoEgresoDTO requestIngreso = new IngresoEgresoDTO(
                20L,
                List.of(
                        new ControlInsumoRequestDTO(100L, 45, null),
                        new ControlInsumoRequestDTO(101L, 10, null)
                ),
                "Ingreso sin observaciones"
        );

        turnoService.registrarIngreso(requestIngreso);

        assertEquals(EstadoTurno.EN_CURSO, turno.getEstado());
        assertEquals("Ingreso sin observaciones", turno.getObservacionesIngreso());
        assertEquals(45, controlCritico.getCantidadIngreso());
        assertEquals(5, controlCritico.getIngresoFaltante());
        verify(repository, times(1)).findById(20L);
        verify(repository, times(1)).save(turno);
    }

    @Test
    void registrarIngreso_errorEstadoNoProgramado() {
        turno.setEstado(EstadoTurno.EN_CURSO);
        when(repository.findById(20L)).thenReturn(Optional.of(turno));

        IngresoEgresoDTO requestIngreso = new IngresoEgresoDTO(20L, List.of(), "Obs");

        assertThrows(IllegalArgumentException.class, () -> turnoService.registrarIngreso(requestIngreso));
        verify(repository, times(1)).findById(20L);
        verify(repository, never()).save(any(Turno.class));
    }

    @Test
    void registrarIngreso_errorInsumosNulosOVacios() {
        when(repository.findById(20L)).thenReturn(Optional.of(turno));

        IngresoEgresoDTO requestIngresoNull = new IngresoEgresoDTO(20L, null, "Obs");
        IngresoEgresoDTO requestIngresoVacio = new IngresoEgresoDTO(20L, List.of(), "Obs");

        assertThrows(IllegalArgumentException.class, () -> turnoService.registrarIngreso(requestIngresoNull));
        assertThrows(IllegalArgumentException.class, () -> turnoService.registrarIngreso(requestIngresoVacio));
        verify(repository, never()).save(any(Turno.class));
    }

    @Test
    void registrarIngreso_errorInsumosDuplicados() {
        when(repository.findById(20L)).thenReturn(Optional.of(turno));

        IngresoEgresoDTO requestDuplicados = new IngresoEgresoDTO(
                20L,
                List.of(
                        new ControlInsumoRequestDTO(100L, 45, null),
                        new ControlInsumoRequestDTO(100L, 45, null)
                ),
                "Obs"
        );

        assertThrows(IllegalArgumentException.class, () -> turnoService.registrarIngreso(requestDuplicados));
        verify(repository, never()).save(any(Turno.class));
    }

    @Test
    void registrarIngreso_errorInsumosNoCoincidenConTurno() {
        when(repository.findById(20L)).thenReturn(Optional.of(turno));

        IngresoEgresoDTO requestInvalido = new IngresoEgresoDTO(
                20L,
                List.of(
                        new ControlInsumoRequestDTO(100L, 45, null),
                        new ControlInsumoRequestDTO(999L, 10, null)
                ),
                "Obs"
        );

        assertThrows(IllegalArgumentException.class, () -> turnoService.registrarIngreso(requestInvalido));
        verify(repository, never()).save(any(Turno.class));
    }

    @Test
    void registrarEgreso_ok() {
        turno.setEstado(EstadoTurno.EN_CURSO);
        when(repository.findById(20L)).thenReturn(Optional.of(turno));
        when(repository.save(any(Turno.class))).thenReturn(turno);

        IngresoEgresoDTO requestEgreso = new IngresoEgresoDTO(
                20L,
                List.of(
                        new ControlInsumoRequestDTO(100L, 30, 10),
                        new ControlInsumoRequestDTO(101L, 8, null)
                ),
                "Egreso completado"
        );

        turnoService.registrarEgreso(requestEgreso);

        assertEquals(EstadoTurno.FINALIZADO, turno.getEstado());
        assertEquals("Egreso completado", turno.getObservacionesEgreso());
        assertEquals(30, controlCritico.getCantidadEgreso());
        assertEquals(10, controlCritico.getCantidadRestockeo());
        assertEquals(20, controlCritico.getCantidadUsada());
        verify(repository, times(1)).findById(20L);
        verify(repository, times(1)).save(turno);
    }

    @Test
    void registrarEgreso_errorEstadoNoEnCurso() {
        turno.setEstado(EstadoTurno.PROGRAMADO);
        when(repository.findById(20L)).thenReturn(Optional.of(turno));

        IngresoEgresoDTO requestEgreso = new IngresoEgresoDTO(20L, List.of(), "Obs");

        assertThrows(IllegalArgumentException.class, () -> turnoService.registrarEgreso(requestEgreso));
        verify(repository, times(1)).findById(20L);
        verify(repository, never()).save(any(Turno.class));
    }

    @Test
    void obtenerTodos_ok() {
        when(repository.findAllByEliminadoIsFalse()).thenReturn(List.of(turno));

        List<TurnoDTO> resultado = turnoService.obtenerTodos();

        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals(20L, resultado.get(0).getId());
        verify(repository, times(1)).findAllByEliminadoIsFalse();
    }

    @Test
    void obtenerPorId_ok() {
        when(repository.findById(20L)).thenReturn(Optional.of(turno));

        TurnoDTO resultado = turnoService.obtenerPorId(20L);

        assertNotNull(resultado);
        assertEquals(20L, resultado.getId());
        verify(repository, times(1)).findById(20L);
    }

    @Test
    void obtenerPorId_errorNoEncontrado() {
        when(repository.findById(20L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> turnoService.obtenerPorId(20L));
        verify(repository, times(1)).findById(20L);
    }

    @Test
    void obtenerTurnosActivos_ok() {
        turno.setEstado(EstadoTurno.EN_CURSO);
        when(repository.findByEstadoAndEliminadoIsFalse(EstadoTurno.EN_CURSO)).thenReturn(List.of(turno));

        List<TurnoDTO> resultado = turnoService.obtenerTurnosActivos();

        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals(EstadoTurno.EN_CURSO, resultado.get(0).getEstado());
        verify(repository, times(1)).findByEstadoAndEliminadoIsFalse(EstadoTurno.EN_CURSO);
    }

    @Test
    void cancelarTurno_ok_conObservaciones() {
        when(repository.findById(20L)).thenReturn(Optional.of(turno));
        when(repository.save(any(Turno.class))).thenReturn(turno);

        TurnoDTO resultado = turnoService.cancelarTurno(20L, "Falta oxigeno urgente");

        assertNotNull(resultado);
        assertEquals(EstadoTurno.CANCELADO, turno.getEstado());
        assertEquals("Falta oxigeno urgente", turno.getObservacionesEgreso());
        verify(repository, times(1)).findById(20L);
        verify(repository, times(1)).save(turno);
    }

    @Test
    void cancelarTurno_ok_observacionesDefault() {
        when(repository.findById(20L)).thenReturn(Optional.of(turno));
        when(repository.save(any(Turno.class))).thenReturn(turno);

        TurnoDTO resultado = turnoService.cancelarTurno(20L, null);

        assertNotNull(resultado);
        assertEquals(EstadoTurno.CANCELADO, turno.getEstado());
        assertEquals("Turno cancelado", turno.getObservacionesEgreso());
        verify(repository, times(1)).findById(20L);
        verify(repository, times(1)).save(turno);
    }

    @Test
    void cancelarTurno_errorEstadoNoProgramado() {
        turno.setEstado(EstadoTurno.EN_CURSO);
        when(repository.findById(20L)).thenReturn(Optional.of(turno));

        assertThrows(IllegalArgumentException.class, () -> turnoService.cancelarTurno(20L, "Obs"));
        verify(repository, times(1)).findById(20L);
        verify(repository, never()).save(any(Turno.class));
    }

    @Test
    void modificarTurno_ok_conAmbulanciaYEnfermero() {
        Turno turnoSinControl = Turno.builder()
                .fecha(LocalDate.now())
                .horario(HorarioTurno.MANIANA)
                .estado(EstadoTurno.PROGRAMADO)
                .admin(admin)
                .enfermero(enfermero)
                .nombreChofer("Chofer Test")
                .nombreMedico("Medico Test")
                .controlInsumos(new ArrayList<>())
                .build();
        turnoSinControl.setId(20L);

        when(repository.findById(20L)).thenReturn(Optional.of(turnoSinControl));
        when(ambulanciaRepository.findByIdAndEliminadoIsFalse(5L)).thenReturn(Optional.of(ambulancia));
        when(usuarioRepository.findByIdAndEliminadoIsFalse(2L)).thenReturn(Optional.of(enfermero));
        when(repository.save(any(Turno.class))).thenReturn(turnoSinControl);

        TurnoDTO resultado = turnoService.modificarTurno(20L, turnoRequestDTO);

        assertNotNull(resultado);
        verify(repository, times(1)).findById(20L);
        verify(ambulanciaRepository, times(1)).findByIdAndEliminadoIsFalse(5L);
        verify(usuarioRepository, times(1)).findByIdAndEliminadoIsFalse(2L);
        verify(repository, times(1)).save(turnoSinControl);
    }

    @Test
    void modificarTurno_errorCambiarAmbulanciaConControlInsumos() {
        when(repository.findById(20L)).thenReturn(Optional.of(turno));
        when(ambulanciaRepository.findByIdAndEliminadoIsFalse(5L)).thenReturn(Optional.of(ambulancia));
        when(usuarioRepository.findByIdAndEliminadoIsFalse(2L)).thenReturn(Optional.of(enfermero));

        assertThrows(IllegalStateException.class, () -> turnoService.modificarTurno(20L, turnoRequestDTO));
        verify(repository, times(1)).findById(20L);
        verify(repository, never()).save(any(Turno.class));
    }

    @Test
    void modificarTurno_ok_sinAmbulanciaNiEnfermero() {
        TurnoRequestDTO requestSinRef = new TurnoRequestDTO(
                LocalDate.now(),
                HorarioTurno.TARDE,
                null,
                null,
                "Nuevo Chofer",
                "Nuevo Medico"
        );
        when(repository.findById(20L)).thenReturn(Optional.of(turno));
        when(repository.save(any(Turno.class))).thenReturn(turno);

        TurnoDTO resultado = turnoService.modificarTurno(20L, requestSinRef);

        assertNotNull(resultado);
        assertEquals(HorarioTurno.TARDE, turno.getHorario());
        assertEquals("Nuevo Chofer", turno.getNombreChofer());
        verify(repository, times(1)).findById(20L);
        verify(ambulanciaRepository, never()).findByIdAndEliminadoIsFalse(anyLong());
        verify(usuarioRepository, never()).findByIdAndEliminadoIsFalse(anyLong());
        verify(repository, times(1)).save(turno);
    }
}
