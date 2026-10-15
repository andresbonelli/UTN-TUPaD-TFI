package com.tup.tfi.control107.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.tup.tfi.control107.config.SecurityConfig;
import com.tup.tfi.control107.dto.ResumenOperativoDTO;
import com.tup.tfi.control107.dto.TurnoDTO;
import com.tup.tfi.control107.dto.request.CancelarTurnoDTO;
import com.tup.tfi.control107.dto.request.IngresoEgresoDTO;
import com.tup.tfi.control107.dto.request.TurnoRequestDTO;
import com.tup.tfi.control107.model.enums.EstadoTurno;
import com.tup.tfi.control107.model.enums.HorarioTurno;
import com.tup.tfi.control107.service.TurnoService;
import com.tup.tfi.control107.util.JwtUtil;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TurnoController.class)
@Import(SecurityConfig.class)
@WithMockUser(roles = "ADMINISTRADOR")
class TurnoControllerTest {


    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

    @MockitoBean
    private TurnoService turnoService;

    @MockitoBean
    private JwtUtil jwtUtil;

    private TurnoDTO turnoDTO;
    private static final Long ID = 1L;
    private static final String CONTEXT_PATH = "/api";
    private static final String BASE_URL = "/api/v1/turnos";

    @BeforeEach
    void setUp() {
        turnoDTO = TurnoDTO.builder()
                .id(ID)
                .fecha(LocalDate.of(2026, 10, 15))
                .horario(HorarioTurno.MANIANA)
                .estado(EstadoTurno.PROGRAMADO)
                .medico("Dr. Perez")
                .chofer("Carlos Chofer")
                .controlInsumos(Set.of())
                .build();
    }

    @Test
    void mostrarTurnos_ok() throws Exception {
        when(turnoService.obtenerTodos()).thenReturn(List.of(turnoDTO));

        mockMvc.perform(get(BASE_URL).contextPath(CONTEXT_PATH))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id").value(ID))
                .andExpect(jsonPath("$[0].medico").value("Dr. Perez"));
    }

    @Test
    void obtenerTurnosActivos_ok() throws Exception {
        when(turnoService.obtenerTurnosActivos()).thenReturn(List.of(turnoDTO));

        mockMvc.perform(get(BASE_URL + "/activos").contextPath(CONTEXT_PATH))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id").value(ID));
    }

    @Test
    void obtenerPorId_ok() throws Exception {
        when(turnoService.obtenerPorId(ID)).thenReturn(turnoDTO);

        mockMvc.perform(get(BASE_URL + "/{id}", ID).contextPath(CONTEXT_PATH))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(ID))
                .andExpect(jsonPath("$.medico").value("Dr. Perez"));
    }

    @Test
    void obtenerPorId_notFound() throws Exception {
        when(turnoService.obtenerPorId(99L))
                .thenThrow(new EntityNotFoundException("No se encontro Turno con id 99"));

        mockMvc.perform(get(BASE_URL + "/{id}", 99L).contextPath(CONTEXT_PATH))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    void obtenerResumenOperativo_ok() throws Exception {
        ResumenOperativoDTO resumen = ResumenOperativoDTO.builder()
                .turnosActivos(2)
                .ambulanciasDisponibles(3)
                .ambulanciasTotales(5)
                .alertas(1)
                .inconsistencias(0)
                .listaAmbulancias(List.of())
                .build();

        when(turnoService.obtenerResumenOperativo()).thenReturn(resumen);

        mockMvc.perform(get(BASE_URL + "/resumen").contextPath(CONTEXT_PATH))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.turnosActivos").value(2))
                .andExpect(jsonPath("$.ambulanciasDisponibles").value(3));
    }

    @Test
    void crearTurno_ok() throws Exception {
        TurnoRequestDTO request = new TurnoRequestDTO(
                LocalDate.of(2026, 10, 15),
                HorarioTurno.MANIANA,
                1L, 2L, 3L,
                "Carlos Chofer", "Dr. Perez"
        );

        when(turnoService.crearTurno(any(TurnoRequestDTO.class))).thenReturn(turnoDTO);

        mockMvc.perform(post(BASE_URL)
                        .contextPath(CONTEXT_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(ID));
    }

    @Test
    void modificarTurno_ok() throws Exception {
        TurnoRequestDTO request = new TurnoRequestDTO(
                LocalDate.of(2026, 10, 15),
                HorarioTurno.MANIANA,
                1L, 2L, 3L,
                "Carlos Chofer", "Dr. Perez"
        );

        when(turnoService.modificarTurno(eq(ID), any(TurnoRequestDTO.class))).thenReturn(turnoDTO);

        mockMvc.perform(put(BASE_URL + "/{id}", ID)
                        .contextPath(CONTEXT_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(ID));
    }

    @Test
    void registrarIngreso_ok() throws Exception {
        IngresoEgresoDTO request = new IngresoEgresoDTO(ID, List.of(), "Ingreso OK");
        doNothing().when(turnoService).registrarIngreso(any(IngresoEgresoDTO.class));

        mockMvc.perform(post(BASE_URL + "/ingreso")
                        .contextPath(CONTEXT_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    void registrarEgreso_ok() throws Exception {
        IngresoEgresoDTO request = new IngresoEgresoDTO(ID, List.of(), "Egreso OK");
        doNothing().when(turnoService).registrarEgreso(any(IngresoEgresoDTO.class));

        mockMvc.perform(post(BASE_URL + "/egreso")
                        .contextPath(CONTEXT_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    void cancelarTurno_ok() throws Exception {
        CancelarTurnoDTO request = new CancelarTurnoDTO("Cancelado por lluvia");
        TurnoDTO cancelado = TurnoDTO.builder()
                .id(ID)
                .estado(EstadoTurno.CANCELADO)
                .build();

        when(turnoService.cancelarTurno(eq(ID), eq("Cancelado por lluvia"))).thenReturn(cancelado);

        mockMvc.perform(post(BASE_URL + "/{id}/cancelar", ID)
                        .contextPath(CONTEXT_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(ID))
                .andExpect(jsonPath("$.estado").value("CANCELADO"));
    }
}
