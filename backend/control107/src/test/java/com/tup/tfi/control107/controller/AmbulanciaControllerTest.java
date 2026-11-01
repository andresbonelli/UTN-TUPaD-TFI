package com.tup.tfi.control107.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tup.tfi.control107.config.SecurityConfig;
import com.tup.tfi.control107.dto.AmbulanciaDTO;
import com.tup.tfi.control107.dto.request.AmbulanciaRequestDTO;
import com.tup.tfi.control107.service.AmbulanciaService;
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

import java.util.List;
import java.util.Set;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AmbulanciaController.class)
@Import(SecurityConfig.class)
@WithMockUser(roles = "ADMINISTRADOR")
class AmbulanciaControllerTest {


    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private AmbulanciaService ambulanciaService;

    @MockitoBean
    private JwtUtil jwtUtil;

    private AmbulanciaDTO ambulanciaDTO;
    private static final Long ID = 1L;
    private static final String PATENTE = "AB123CD";
    private static final String CONTEXT_PATH = "/api";
    private static final String BASE_URL = "/api/v1/ambulancias";

    @BeforeEach
    void setUp() {
        ambulanciaDTO = AmbulanciaDTO.builder()
                .id(ID)
                .patente(PATENTE)
                .disponible(true)
                .insumos(Set.of())
                .build();
    }

    @Test
    void listarTodas_ok() throws Exception {
        when(ambulanciaService.listarTodas()).thenReturn(List.of(ambulanciaDTO));

        mockMvc.perform(get(BASE_URL).contextPath(CONTEXT_PATH))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id").value(ID))
                .andExpect(jsonPath("$[0].patente").value(PATENTE))
                .andExpect(jsonPath("$[0].disponible").value(true));
    }

    @Test
    void obtenerPorId_ok() throws Exception {
        when(ambulanciaService.obtenerPorId(ID)).thenReturn(ambulanciaDTO);

        mockMvc.perform(get(BASE_URL + "/{id}", ID).contextPath(CONTEXT_PATH))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(ID))
                .andExpect(jsonPath("$.patente").value(PATENTE));
    }

    @Test
    void obtenerPorId_notFound() throws Exception {
        when(ambulanciaService.obtenerPorId(99L))
                .thenThrow(new EntityNotFoundException("No se encontro Ambulancia con id 99"));

        mockMvc.perform(get(BASE_URL + "/{id}", 99L).contextPath(CONTEXT_PATH))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    void guardar_ok() throws Exception {
        AmbulanciaRequestDTO request = new AmbulanciaRequestDTO(PATENTE, true, Set.of());
        when(ambulanciaService.crearAmbulancia(any(AmbulanciaRequestDTO.class))).thenReturn(ambulanciaDTO);

        mockMvc.perform(post(BASE_URL)
                        .contextPath(CONTEXT_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(ID))
                .andExpect(jsonPath("$.patente").value(PATENTE));
    }

    @Test
    void guardar_patenteDuplicada_badRequest() throws Exception {
        AmbulanciaRequestDTO request = new AmbulanciaRequestDTO(PATENTE, true, Set.of());
        when(ambulanciaService.crearAmbulancia(any(AmbulanciaRequestDTO.class)))
                .thenThrow(new IllegalArgumentException("Ya existe una ambulancia con esa patente"));

        mockMvc.perform(post(BASE_URL)
                        .contextPath(CONTEXT_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.detalles[0]").value("Ya existe una ambulancia con esa patente"));
    }

    @Test
    void actualizar_ok() throws Exception {
        AmbulanciaRequestDTO request = new AmbulanciaRequestDTO("AB 999 CD", true, Set.of());
        AmbulanciaDTO updated = AmbulanciaDTO.builder()
                .id(ID)
                .patente("AB 999 CD")
                .disponible(true)
                .insumos(Set.of())
                .build();
        when(ambulanciaService.actualizarAmbulancia(eq(ID), any(AmbulanciaRequestDTO.class))).thenReturn(updated);

        mockMvc.perform(put(BASE_URL + "/{id}", ID)
                        .contextPath(CONTEXT_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(ID))
                .andExpect(jsonPath("$.patente").value("AB 999 CD"));
    }

    @Test
    void actualizar_notFound() throws Exception {
        AmbulanciaRequestDTO request = new AmbulanciaRequestDTO(PATENTE, true, Set.of());
        when(ambulanciaService.actualizarAmbulancia(eq(99L), any(AmbulanciaRequestDTO.class)))
                .thenThrow(new EntityNotFoundException("No se encontro Ambulancia con id 99"));

        mockMvc.perform(put(BASE_URL + "/{id}", 99L)
                        .contextPath(CONTEXT_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    void actualizar_patenteDuplicada_badRequest() throws Exception {
        AmbulanciaRequestDTO request = new AmbulanciaRequestDTO(PATENTE, true, Set.of());
        when(ambulanciaService.actualizarAmbulancia(eq(ID), any(AmbulanciaRequestDTO.class)))
                .thenThrow(new IllegalArgumentException("Ya existe una ambulancia con esa patente"));

        mockMvc.perform(put(BASE_URL + "/{id}", ID)
                        .contextPath(CONTEXT_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }

    @Test
    void eliminar_ok() throws Exception {
        doNothing().when(ambulanciaService).eliminarPorId(ID);

        mockMvc.perform(delete(BASE_URL + "/{id}", ID).contextPath(CONTEXT_PATH))
                .andExpect(status().isNoContent());
    }

    @Test
    void eliminar_notFound() throws Exception {
        doThrow(new EntityNotFoundException("No se encontro Ambulancia con id 99"))
                .when(ambulanciaService).eliminarPorId(99L);

        mockMvc.perform(delete(BASE_URL + "/{id}", 99L).contextPath(CONTEXT_PATH))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }
}
