package com.tup.tfi.control107.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tup.tfi.control107.dto.CategoriaInsumoDTO;
import com.tup.tfi.control107.dto.request.CategoriaInsumoRequestDTO;
import com.tup.tfi.control107.service.CategoriaInsumoService;
import com.tup.tfi.control107.util.JwtUtil;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
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

import org.springframework.context.annotation.Import;
import com.tup.tfi.control107.config.SecurityConfig;

@WebMvcTest(CategoriaInsumoController.class)
@Import(SecurityConfig.class)
@WithMockUser(roles = "ADMINISTRADOR")
class CategoriaInsumoControllerTest {


    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private CategoriaInsumoService categoriaInsumoService;

    // Resuelve UnsatisfiedDependencyException en JwtFilter
    @MockitoBean
    private JwtUtil jwtUtil;

    private CategoriaInsumoDTO categoriaInsumoDTO;
    private List<CategoriaInsumoDTO> categoriaInsumoDTOList;

    private static final long ID = 1L;
    private static final String NOMBRE = "test-categoria";
    private static final String COLOR = "#000000";
    private static final String CONTEXT_PATH = "/api";
    private static final String BASE_URL = "/api/v1/categorias";

    @BeforeEach
    void setUp() {
        categoriaInsumoDTO = new CategoriaInsumoDTO();
        categoriaInsumoDTO.setId(ID);
        categoriaInsumoDTO.setNombre(NOMBRE);
        categoriaInsumoDTO.setColor(COLOR);
        categoriaInsumoDTOList = List.of(categoriaInsumoDTO);
    }

    @Test
    void listarTodas() throws Exception {
        // Arrange
        when(categoriaInsumoService.listarTodas()).thenReturn(categoriaInsumoDTOList);

        // Act & Assert
        mockMvc.perform(get(BASE_URL).contextPath(CONTEXT_PATH))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id").value(ID))
                .andExpect(jsonPath("$[0].nombre").value(NOMBRE))
                .andExpect(jsonPath("$[0].color").value(COLOR));
    }

    @Test
    void obtenerPorId_ok() throws Exception {
        // Arrange
        when(categoriaInsumoService.obtenerPorId(ID)).thenReturn(categoriaInsumoDTO);

        // Act & Assert
        mockMvc.perform(get(BASE_URL + "/{id}", ID).contextPath(CONTEXT_PATH))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(ID))
                .andExpect(jsonPath("$.nombre").value(NOMBRE))
                .andExpect(jsonPath("$.color").value(COLOR));
    }

    @Test
    void obtenerPorId_notFound() throws Exception {
        // Arrange
        when(categoriaInsumoService.obtenerPorId(99L))
                .thenThrow(new EntityNotFoundException("No se encontro CategoriaInsumo con id 99"));

        // Act & Assert
        mockMvc.perform(get(BASE_URL + "/{id}", 99L).contextPath(CONTEXT_PATH))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Recurso no encontrado"));
    }

    @Test
    void crear_ok() throws Exception {
        // Arrange
        CategoriaInsumoRequestDTO request = new CategoriaInsumoRequestDTO(NOMBRE, COLOR);
        when(categoriaInsumoService.crearCategoria(any(CategoriaInsumoRequestDTO.class)))
                .thenReturn(categoriaInsumoDTO);

        // Act & Assert
        mockMvc.perform(post(BASE_URL)
                        .contextPath(CONTEXT_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(ID))
                .andExpect(jsonPath("$.nombre").value(NOMBRE))
                .andExpect(jsonPath("$.color").value(COLOR));
    }

    @Test
    void crear_nombreDuplicado_badRequest() throws Exception {
        // Arrange
        CategoriaInsumoRequestDTO request = new CategoriaInsumoRequestDTO(NOMBRE, COLOR);
        when(categoriaInsumoService.crearCategoria(any(CategoriaInsumoRequestDTO.class)))
                .thenThrow(new IllegalArgumentException("Ya existe una categoría con ese nombre"));

        // Act & Assert
        mockMvc.perform(post(BASE_URL)
                        .contextPath(CONTEXT_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Error de validación"))
                .andExpect(jsonPath("$.detalles[0]").value("Ya existe una categoría con ese nombre"));
    }

    @Test
    void actualizar_ok() throws Exception {
        // Arrange
        CategoriaInsumoRequestDTO request = new CategoriaInsumoRequestDTO("categoria-modificada", "#FFFFFF");
        CategoriaInsumoDTO updatedDTO = new CategoriaInsumoDTO();
        updatedDTO.setId(ID);
        updatedDTO.setNombre("categoria-modificada");
        updatedDTO.setColor("#FFFFFF");

        when(categoriaInsumoService.actualizarCategoria(eq(ID), any(CategoriaInsumoRequestDTO.class)))
                .thenReturn(updatedDTO);

        // Act & Assert
        mockMvc.perform(put(BASE_URL + "/{id}", ID)
                        .contextPath(CONTEXT_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(ID))
                .andExpect(jsonPath("$.nombre").value("categoria-modificada"))
                .andExpect(jsonPath("$.color").value("#FFFFFF"));
    }

    @Test
    void actualizar_notFound() throws Exception {
        // Arrange
        CategoriaInsumoRequestDTO request = new CategoriaInsumoRequestDTO("modificada", "#FFFFFF");
        when(categoriaInsumoService.actualizarCategoria(eq(99L), any(CategoriaInsumoRequestDTO.class)))
                .thenThrow(new EntityNotFoundException("No se encontro CategoriaInsumo con id 99"));

        // Act & Assert
        mockMvc.perform(put(BASE_URL + "/{id}", 99L)
                        .contextPath(CONTEXT_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    void actualizar_nombreDuplicado_badRequest() throws Exception {
        // Arrange
        CategoriaInsumoRequestDTO request = new CategoriaInsumoRequestDTO(NOMBRE, COLOR);
        when(categoriaInsumoService.actualizarCategoria(eq(ID), any(CategoriaInsumoRequestDTO.class)))
                .thenThrow(new IllegalArgumentException("Ya existe una categoría con ese nombre"));

        // Act & Assert
        mockMvc.perform(put(BASE_URL + "/{id}", ID)
                        .contextPath(CONTEXT_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Error de validación"));
    }

    @Test
    void eliminar_ok() throws Exception {
        // Arrange
        doNothing().when(categoriaInsumoService).eliminarPorId(ID);

        // Act & Assert
        mockMvc.perform(delete(BASE_URL + "/{id}", ID).contextPath(CONTEXT_PATH))
                .andExpect(status().isNoContent());
    }

    @Test
    void eliminar_notFound() throws Exception {
        // Arrange
        doThrow(new EntityNotFoundException("No se encontro CategoriaInsumo con id 99"))
                .when(categoriaInsumoService).eliminarPorId(99L);

        // Act & Assert
        mockMvc.perform(delete(BASE_URL + "/{id}", 99L).contextPath(CONTEXT_PATH))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }
}