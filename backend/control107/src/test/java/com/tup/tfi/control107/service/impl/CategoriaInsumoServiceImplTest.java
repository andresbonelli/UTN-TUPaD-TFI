package com.tup.tfi.control107.service.impl;

import com.tup.tfi.control107.dto.CategoriaInsumoDTO;
import com.tup.tfi.control107.dto.request.CategoriaInsumoRequestDTO;
import com.tup.tfi.control107.model.entity.CategoriaInsumo;
import com.tup.tfi.control107.repository.CategoriaRepository;
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
class CategoriaInsumoServiceImplTest {

    @Mock
    private CategoriaRepository repository;

    @InjectMocks
    private CategoriaInsumoServiceImpl categoriaService;

    private CategoriaInsumo categoria;
    private CategoriaInsumoRequestDTO requestDTO;

    @BeforeEach
    void setUp() {
        categoria = CategoriaInsumo.builder()
                .nombre("FARMACOLOGICOS")
                .color("#D9574C")
                .build();
        categoria.setId(1L);

        requestDTO = new CategoriaInsumoRequestDTO("FARMACOLOGICOS", "#D9574C");
    }

    @Test
    void listarTodas_ok() {
        when(repository.findAllByEliminadoIsFalse()).thenReturn(List.of(categoria));

        List<CategoriaInsumoDTO> resultado = categoriaService.listarTodas();

        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals("FARMACOLOGICOS", resultado.get(0).getNombre());
        verify(repository, times(1)).findAllByEliminadoIsFalse();
    }

    @Test
    void obtenerPorId_ok() {
        when(repository.findById(1L)).thenReturn(Optional.of(categoria));

        CategoriaInsumoDTO resultado = categoriaService.obtenerPorId(1L);

        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        assertEquals("FARMACOLOGICOS", resultado.getNombre());
        verify(repository, times(1)).findById(1L);
    }

    @Test
    void obtenerPorId_errorNoEncontrada() {
        when(repository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> categoriaService.obtenerPorId(1L));
        verify(repository, times(1)).findById(1L);
    }

    @Test
    void crearCategoria_ok() {
        when(repository.save(any(CategoriaInsumo.class))).thenReturn(categoria);

        CategoriaInsumoDTO resultado = categoriaService.crearCategoria(requestDTO);

        assertNotNull(resultado);
        assertEquals("FARMACOLOGICOS", resultado.getNombre());
        verify(repository, times(1)).save(any(CategoriaInsumo.class));
    }

    @Test
    void actualizarCategoria_ok() {
        when(repository.findById(1L)).thenReturn(Optional.of(categoria));
        when(repository.save(any(CategoriaInsumo.class))).thenReturn(categoria);

        CategoriaInsumoDTO resultado = categoriaService.actualizarCategoria(1L, requestDTO);

        assertNotNull(resultado);
        assertEquals("FARMACOLOGICOS", resultado.getNombre());
        verify(repository, times(1)).findById(1L);
        verify(repository, times(1)).save(categoria);
    }

    @Test
    void actualizarCategoria_errorNoEncontrada() {
        when(repository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> categoriaService.actualizarCategoria(1L, requestDTO));
        verify(repository, times(1)).findById(1L);
        verify(repository, never()).save(any(CategoriaInsumo.class));
    }

    @Test
    void eliminarPorId_ok() {
        when(repository.findById(1L)).thenReturn(Optional.of(categoria));

        categoriaService.eliminarPorId(1L);

        assertTrue(categoria.isEliminado());
        verify(repository, times(1)).findById(1L);
        verify(repository, times(1)).save(categoria);
    }

    @Test
    void eliminarPorId_errorNoEncontrada() {
        when(repository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> categoriaService.eliminarPorId(1L));
        verify(repository, times(1)).findById(1L);
        verify(repository, never()).save(any(CategoriaInsumo.class));
    }
}
