package com.tup.tfi.control107.service.impl;

import com.tup.tfi.control107.dto.UsuarioDTO;
import com.tup.tfi.control107.dto.request.UsuarioRequestDTO;
import com.tup.tfi.control107.model.entity.Usuario;
import com.tup.tfi.control107.model.enums.RolUsuario;
import com.tup.tfi.control107.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceImplTest {

    @Mock
    private UsuarioRepository repository;

    @InjectMocks
    private UsuarioServiceImpl usuarioService;

    private Usuario usuario;
    private UsuarioRequestDTO requestDTO;

    @BeforeEach
    void setUp() {
        usuario = Usuario.builder()
                .nombre("Hugo Catalan")
                .dni("30111222")
                .email("hugo.catalan@control107.gob.ar")
                .rol(RolUsuario.ADMINISTRADOR)
                .activo(true)
                .build();
        usuario.setId(1L);

        requestDTO = new UsuarioRequestDTO("Hugo Catalan", "30111222", "hugo.catalan@control107.gob.ar", RolUsuario.ADMINISTRADOR, "1234",true);
    }

    @Test
    void listarTodos_ok() {
        when(repository.findAllByEliminadoIsFalse()).thenReturn(List.of(usuario));

        List<UsuarioDTO> resultado = usuarioService.listarTodos();

        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals("Hugo Catalan", resultado.get(0).getNombre());
        verify(repository, times(1)).findAllByEliminadoIsFalse();
    }

    @Test
    void obtenerPorId_ok() {
        when(repository.findById(1L)).thenReturn(Optional.of(usuario));

        UsuarioDTO resultado = usuarioService.obtenerPorId(1L);

        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        assertEquals("Hugo Catalan", resultado.getNombre());
        verify(repository, times(1)).findById(1L);
    }

    @Test
    void obtenerPorId_errorNoEncontrado() {
        when(repository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> usuarioService.obtenerPorId(1L));
        verify(repository, times(1)).findById(1L);
    }

    @Test
    void crearUsuario_ok() {
        when(repository.save(any(Usuario.class))).thenReturn(usuario);

        UsuarioDTO resultado = usuarioService.crearUsuario(requestDTO);

        assertNotNull(resultado);
        assertEquals("Hugo Catalan", resultado.getNombre());
        verify(repository, times(1)).save(any(Usuario.class));
    }

    @Test
    void crearUsuario_errorDniDuplicado() {
        when(repository.existsByDniAndEliminadoIsFalse("30111222")).thenReturn(true);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> usuarioService.crearUsuario(requestDTO));

        assertEquals("Ya existe un usuario con ese DNI", ex.getMessage());
        verify(repository, never()).save(any(Usuario.class));
    }

    @Test
    void crearUsuario_errorEmailDuplicado() {
        when(repository.existsByDniAndEliminadoIsFalse("30111222")).thenReturn(false);
        when(repository.existsByEmailIgnoreCaseAndEliminadoIsFalse("hugo.catalan@control107.gob.ar")).thenReturn(true);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> usuarioService.crearUsuario(requestDTO));

        assertEquals("Ya existe un usuario con ese email", ex.getMessage());
        verify(repository, never()).save(any(Usuario.class));
    }

    @Test
    void actualizarUsuario_ok() {
        when(repository.findById(1L)).thenReturn(Optional.of(usuario));
        when(repository.save(any(Usuario.class))).thenReturn(usuario);

        UsuarioDTO resultado = usuarioService.actualizarUsuario(1L, requestDTO);

        assertNotNull(resultado);
        assertEquals("Hugo Catalan", resultado.getNombre());
        verify(repository, times(1)).findById(1L);
        verify(repository, times(1)).save(usuario);
    }

    @Test
    void actualizarUsuario_errorDniDuplicado() {
        when(repository.existsByDniAndEliminadoIsFalseAndIdNot("30111222", 1L)).thenReturn(true);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> usuarioService.actualizarUsuario(1L, requestDTO));

        assertEquals("Ya existe un usuario con ese DNI", ex.getMessage());
        verify(repository, never()).findById(anyLong());
        verify(repository, never()).save(any(Usuario.class));
    }

    @Test
    void actualizarUsuario_errorEmailDuplicado() {
        when(repository.existsByDniAndEliminadoIsFalseAndIdNot("30111222", 1L)).thenReturn(false);
        when(repository.existsByEmailIgnoreCaseAndEliminadoIsFalseAndIdNot("hugo.catalan@control107.gob.ar", 1L)).thenReturn(true);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> usuarioService.actualizarUsuario(1L, requestDTO));

        assertEquals("Ya existe un usuario con ese email", ex.getMessage());
        verify(repository, never()).findById(anyLong());
        verify(repository, never()).save(any(Usuario.class));
    }

    @Test
    void actualizarUsuario_errorNoEncontrado() {
        when(repository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> usuarioService.actualizarUsuario(1L, requestDTO));
        verify(repository, times(1)).findById(1L);
        verify(repository, never()).save(any(Usuario.class));
    }

    @Test
    void eliminarPorId_ok() {
        when(repository.findById(1L)).thenReturn(Optional.of(usuario));

        usuarioService.eliminarPorId(1L);

        assertTrue(usuario.isEliminado());
        verify(repository, times(1)).findById(1L);
        verify(repository, times(1)).save(usuario);
    }

    @Test
    void eliminarPorId_errorNoEncontrado() {
        when(repository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> usuarioService.eliminarPorId(1L));
        verify(repository, times(1)).findById(1L);
        verify(repository, never()).save(any(Usuario.class));
    }
}
