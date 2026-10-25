package com.tup.tfi.control107.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tup.tfi.control107.config.SecurityConfig;
import com.tup.tfi.control107.dto.LoginDTO;
import com.tup.tfi.control107.dto.request.LoginRequestDTO;
import com.tup.tfi.control107.exception.CredencialesInvalidasException;
import com.tup.tfi.control107.service.AuthService;
import com.tup.tfi.control107.util.JwtUtil;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@Import(SecurityConfig.class)
@WithMockUser
class AuthControllerTest {


    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private AuthService authService;

    @MockitoBean
    private JwtUtil jwtUtil;

    private static final String CONTEXT_PATH = "/api";
    private static final String BASE_URL = "/api/v1/auth";

    @Test
    void login_ok() throws Exception {
        LoginRequestDTO request = new LoginRequestDTO("admin", "admin123");
        LoginDTO response = new LoginDTO("mock-token", 3600L, "Bearer", "message:read");

        when(authService.login(any(LoginRequestDTO.class))).thenReturn(response);

        mockMvc.perform(post(BASE_URL + "/login")
                        .contextPath(CONTEXT_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.access_token").value("mock-token"))
                .andExpect(jsonPath("$.token_type").value("Bearer"))
                .andExpect(jsonPath("$.scope").value("message:read"));
    }

    @Test
    void login_credencialesInvalidas_unauthorized() throws Exception {
        LoginRequestDTO request = new LoginRequestDTO("admin", "wrong-pwd");

        when(authService.login(any(LoginRequestDTO.class)))
                .thenThrow(new CredencialesInvalidasException());

        mockMvc.perform(post(BASE_URL + "/login")
                        .contextPath(CONTEXT_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.error").value("Credenciales inválidas"));
    }
}
