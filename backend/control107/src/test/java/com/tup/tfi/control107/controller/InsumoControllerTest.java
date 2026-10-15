package com.tup.tfi.control107.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tup.tfi.control107.config.SecurityConfig;
import com.tup.tfi.control107.dto.InsumoDTO;
import com.tup.tfi.control107.dto.request.InsumoRequestDTO;
import com.tup.tfi.control107.service.InsumoService;
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

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(InsumoController.class)
@Import(SecurityConfig.class)
@WithMockUser(roles = "ADMINISTRADOR")
class InsumoControllerTest {


    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private InsumoService insumoService;

    @MockitoBean
    private JwtUtil jwtUtil;

    private InsumoDTO insumoDTO;
    private static final Long ID = 1L;
    private static final String NOMBRE = "Adrenalina 1mg";
    private static final String CATEGORIA = "FARMACOLOGICOS";
    private static final String CONTEXT_PATH = "/api";
    private static final String BASE_URL = "/api/v1/insumos";

    @BeforeEach
    void setUp() {
        insumoDTO = InsumoDTO.builder()
                .id(ID)
                .nombre(NOMBRE)
                .categoria(CATEGORIA)
                .puntoControl(20)
                .esCritico(true)
                .build();
    }

    @Test
    void listarTodos_ok() throws Exception {
        when(insumoService.listarTodos()).thenReturn(List.of(insumoDTO));

        mockMvc.perform(get(BASE_URL).contextPath(CONTEXT_PATH))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id").value(ID))
                .andExpect(jsonPath("$[0].nombre").value(NOMBRE))
                .andExpect(jsonPath("$[0].categoria").value(CATEGORIA));
    }

    @Test
    void listarCriticos_ok() throws Exception {
        when(insumoService.listarCriticos()).thenReturn(List.of(insumoDTO));

        mockMvc.perform(get(BASE_URL + "/criticos").contextPath(CONTEXT_PATH))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].esCritico").value(true));
    }

    @Test
    void listarPorCategoria_ok() throws Exception {
        when(insumoService.listarPorCategoria(10L)).thenReturn(List.of(insumoDTO));

        mockMvc.perform(get(BASE_URL + "/categoria/{categoriaId}", 10L).contextPath(CONTEXT_PATH))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].categoria").value(CATEGORIA));
    }

    @Test
    void obtenerPorId_ok() throws Exception {
        when(insumoService.obtenerPorId(ID)).thenReturn(insumoDTO);

        mockMvc.perform(get(BASE_URL + "/{id}", ID).contextPath(CONTEXT_PATH))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(ID))
                .andExpect(jsonPath("$.nombre").value(NOMBRE));
    }

    @Test
    void obtenerPorId_notFound() throws Exception {
        when(insumoService.obtenerPorId(99L))
                .thenThrow(new EntityNotFoundException("No se encontro Insumo con id 99"));

        mockMvc.perform(get(BASE_URL + "/{id}", 99L).contextPath(CONTEXT_PATH))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    void crear_ok() throws Exception {
        InsumoRequestDTO request = new InsumoRequestDTO(NOMBRE, 10L, 20, true);
        when(insumoService.crearInsumo(any(InsumoRequestDTO.class))).thenReturn(insumoDTO);

        mockMvc.perform(post(BASE_URL)
                        .contextPath(CONTEXT_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(ID))
                .andExpect(jsonPath("$.nombre").value(NOMBRE));
    }

    @Test
    void crear_nombreDuplicado_badRequest() throws Exception {
        InsumoRequestDTO request = new InsumoRequestDTO(NOMBRE, 10L, 20, true);
        when(insumoService.crearInsumo(any(InsumoRequestDTO.class)))
                .thenThrow(new IllegalArgumentException("Ya existe un insumo con ese nombre"));

        mockMvc.perform(post(BASE_URL)
                        .contextPath(CONTEXT_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.detalles[0]").value("Ya existe un insumo con ese nombre"));
    }

    @Test
    void actualizar_ok() throws Exception {
        InsumoRequestDTO request = new InsumoRequestDTO("Adrenalina 2mg", 10L, 25, true);
        InsumoDTO updatedDTO = InsumoDTO.builder()
                .id(ID)
                .nombre("Adrenalina 2mg")
                .categoria(CATEGORIA)
                .puntoControl(25)
                .esCritico(true)
                .build();
        when(insumoService.actualizarInsumo(eq(ID), any(InsumoRequestDTO.class))).thenReturn(updatedDTO);

        mockMvc.perform(put(BASE_URL + "/{id}", ID)
                        .contextPath(CONTEXT_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(ID))
                .andExpect(jsonPath("$.nombre").value("Adrenalina 2mg"));
    }

    @Test
    void actualizar_notFound() throws Exception {
        InsumoRequestDTO request = new InsumoRequestDTO("Insumo", 10L, 5, false);
        when(insumoService.actualizarInsumo(eq(99L), any(InsumoRequestDTO.class)))
                .thenThrow(new EntityNotFoundException("No se encontro Insumo con id 99"));

        mockMvc.perform(put(BASE_URL + "/{id}", 99L)
                        .contextPath(CONTEXT_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    void actualizar_nombreDuplicado_badRequest() throws Exception {
        InsumoRequestDTO request = new InsumoRequestDTO(NOMBRE, 10L, 20, true);
        when(insumoService.actualizarInsumo(eq(ID), any(InsumoRequestDTO.class)))
                .thenThrow(new IllegalArgumentException("Ya existe un insumo con ese nombre"));

        mockMvc.perform(put(BASE_URL + "/{id}", ID)
                        .contextPath(CONTEXT_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.detalles[0]").value("Ya existe un insumo con ese nombre"));
    }

    @Test
    void eliminar_ok() throws Exception {
        doNothing().when(insumoService).eliminarPorId(ID);

        mockMvc.perform(delete(BASE_URL + "/{id}", ID).contextPath(CONTEXT_PATH))
                .andExpect(status().isNoContent());
    }

    @Test
    void eliminar_notFound() throws Exception {
        doThrow(new EntityNotFoundException("No se encontro Insumo con id 99"))
                .when(insumoService).eliminarPorId(99L);

        mockMvc.perform(delete(BASE_URL + "/{id}", 99L).contextPath(CONTEXT_PATH))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }
}
