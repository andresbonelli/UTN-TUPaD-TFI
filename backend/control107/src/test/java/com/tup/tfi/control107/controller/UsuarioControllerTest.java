package com.tup.tfi.control107.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tup.tfi.control107.config.SecurityConfig;
import com.tup.tfi.control107.dto.UsuarioDTO;
import com.tup.tfi.control107.dto.request.UsuarioRequestDTO;
import com.tup.tfi.control107.model.enums.RolUsuario;
import com.tup.tfi.control107.service.UsuarioService;
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

@WebMvcTest(UsuarioController.class)
@Import(SecurityConfig.class)
@WithMockUser(roles = "ADMINISTRADOR")
class UsuarioControllerTest {


    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private UsuarioService usuarioService;

    @MockitoBean
    private JwtUtil jwtUtil;

    private UsuarioDTO usuarioDTO;
    private static final Long ID = 1L;
    private static final String NOMBRE = "Hugo Catalan";
    private static final String DNI = "30111222";
    private static final String EMAIL = "hugo.catalan@control107.gob.ar";
    private static final String CONTEXT_PATH = "/api";
    private static final String BASE_URL = "/api/v1/usuarios";

    @BeforeEach
    void setUp() {
        usuarioDTO = UsuarioDTO.builder()
                .id(ID)
                .nombre(NOMBRE)
                .dni(DNI)
                .email(EMAIL)
                .rol(RolUsuario.ADMINISTRADOR)
                .activo(true)
                .build();
    }

    @Test
    void listarTodos_ok() throws Exception {
        when(usuarioService.listarTodos()).thenReturn(List.of(usuarioDTO));

        mockMvc.perform(get(BASE_URL).contextPath(CONTEXT_PATH))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id").value(ID))
                .andExpect(jsonPath("$[0].nombre").value(NOMBRE))
                .andExpect(jsonPath("$[0].dni").value(DNI))
                .andExpect(jsonPath("$[0].email").value(EMAIL));
    }

    @Test
    void obtenerPorId_ok() throws Exception {
        when(usuarioService.obtenerPorId(ID)).thenReturn(usuarioDTO);

        mockMvc.perform(get(BASE_URL + "/{id}", ID).contextPath(CONTEXT_PATH))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(ID))
                .andExpect(jsonPath("$.nombre").value(NOMBRE))
                .andExpect(jsonPath("$.dni").value(DNI));
    }

    @Test
    void obtenerPorId_notFound() throws Exception {
        when(usuarioService.obtenerPorId(99L))
                .thenThrow(new EntityNotFoundException("No se encontro Usuario con id 99"));

        mockMvc.perform(get(BASE_URL + "/{id}", 99L).contextPath(CONTEXT_PATH))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    void crear_ok() throws Exception {
        UsuarioRequestDTO request = new UsuarioRequestDTO(NOMBRE, DNI, EMAIL, RolUsuario.ADMINISTRADOR, "1234", true);
        when(usuarioService.crearUsuario(any(UsuarioRequestDTO.class))).thenReturn(usuarioDTO);

        mockMvc.perform(post(BASE_URL)
                        .contextPath(CONTEXT_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(ID))
                .andExpect(jsonPath("$.nombre").value(NOMBRE))
                .andExpect(jsonPath("$.dni").value(DNI));
    }

    @Test
    void crear_dniDuplicado_badRequest() throws Exception {
        UsuarioRequestDTO request = new UsuarioRequestDTO(NOMBRE, DNI, EMAIL, RolUsuario.ADMINISTRADOR, "1234", true);
        when(usuarioService.crearUsuario(any(UsuarioRequestDTO.class)))
                .thenThrow(new IllegalArgumentException("Ya existe un usuario con ese DNI"));

        mockMvc.perform(post(BASE_URL)
                        .contextPath(CONTEXT_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.detalles[0]").value("Ya existe un usuario con ese DNI"));
    }

    @Test
    void crear_emailDuplicado_badRequest() throws Exception {
        UsuarioRequestDTO request = new UsuarioRequestDTO(NOMBRE, DNI, EMAIL, RolUsuario.ADMINISTRADOR, "1234", true);
        when(usuarioService.crearUsuario(any(UsuarioRequestDTO.class)))
                .thenThrow(new IllegalArgumentException("Ya existe un usuario con ese email"));

        mockMvc.perform(post(BASE_URL)
                        .contextPath(CONTEXT_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.detalles[0]").value("Ya existe un usuario con ese email"));
    }

    @Test
    void actualizar_ok() throws Exception {
        UsuarioRequestDTO request = new UsuarioRequestDTO("Hugo C.", DNI, EMAIL, RolUsuario.ADMINISTRADOR, "1234", true);
        UsuarioDTO updated = UsuarioDTO.builder()
                .id(ID)
                .nombre("Hugo C.")
                .dni(DNI)
                .email(EMAIL)
                .rol(RolUsuario.ADMINISTRADOR)
                .activo(true)
                .build();
        when(usuarioService.actualizarUsuario(eq(ID), any(UsuarioRequestDTO.class))).thenReturn(updated);

        mockMvc.perform(put(BASE_URL + "/{id}", ID)
                        .contextPath(CONTEXT_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(ID))
                .andExpect(jsonPath("$.nombre").value("Hugo C."));
    }

    @Test
    void actualizar_notFound() throws Exception {
        UsuarioRequestDTO request = new UsuarioRequestDTO(NOMBRE, DNI, EMAIL, RolUsuario.ADMINISTRADOR, "1234", true);
        when(usuarioService.actualizarUsuario(eq(99L), any(UsuarioRequestDTO.class)))
                .thenThrow(new EntityNotFoundException("No se encontro Usuario con id 99"));

        mockMvc.perform(put(BASE_URL + "/{id}", 99L)
                        .contextPath(CONTEXT_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    void actualizar_dniDuplicado_badRequest() throws Exception {
        UsuarioRequestDTO request = new UsuarioRequestDTO(NOMBRE, DNI, EMAIL, RolUsuario.ADMINISTRADOR, "1234", true);
        when(usuarioService.actualizarUsuario(eq(ID), any(UsuarioRequestDTO.class)))
                .thenThrow(new IllegalArgumentException("Ya existe un usuario con ese DNI"));

        mockMvc.perform(put(BASE_URL + "/{id}", ID)
                        .contextPath(CONTEXT_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }

    @Test
    void actualizar_emailDuplicado_badRequest() throws Exception {
        UsuarioRequestDTO request = new UsuarioRequestDTO(NOMBRE, DNI, EMAIL, RolUsuario.ADMINISTRADOR, "1234", true);
        when(usuarioService.actualizarUsuario(eq(ID), any(UsuarioRequestDTO.class)))
                .thenThrow(new IllegalArgumentException("Ya existe un usuario con ese email"));

        mockMvc.perform(put(BASE_URL + "/{id}", ID)
                        .contextPath(CONTEXT_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }

    @Test
    void eliminar_ok() throws Exception {
        doNothing().when(usuarioService).eliminarPorId(ID);

        mockMvc.perform(delete(BASE_URL + "/{id}", ID).contextPath(CONTEXT_PATH))
                .andExpect(status().isNoContent());
    }

    @Test
    void eliminar_notFound() throws Exception {
        doThrow(new EntityNotFoundException("No se encontro Usuario con id 99"))
                .when(usuarioService).eliminarPorId(99L);

        mockMvc.perform(delete(BASE_URL + "/{id}", 99L).contextPath(CONTEXT_PATH))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }
}
