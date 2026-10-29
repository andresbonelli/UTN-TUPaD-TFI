package com.tup.tfi.control107.service.impl;

import com.tup.tfi.control107.dto.InsumoDTO;
import com.tup.tfi.control107.dto.request.InsumoRequestDTO;
import com.tup.tfi.control107.model.entity.CategoriaInsumo;
import com.tup.tfi.control107.model.entity.Insumo;
import com.tup.tfi.control107.repository.AmbulanciaRepository;
import com.tup.tfi.control107.repository.CategoriaRepository;
import com.tup.tfi.control107.repository.InsumoRepository;
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
class InsumoServiceImplTest {

    @Mock
    private InsumoRepository insumoRepository;

    @Mock
    private CategoriaRepository categoriaRepository;

    @Mock
    private AmbulanciaRepository ambulanciaRepository;

    @InjectMocks
    private InsumoServiceImpl insumoService;

    private CategoriaInsumo categoria;
    private Insumo insumo;
    private InsumoRequestDTO requestDTO;
    
    private static final String NOMBRE_CATEGORIA = "FARMACOLOGICOS";
    private static final String COLOR_CATEGORIA = "#D9574C";
    private static final String NOMBRE_INSUMO = "Adrenalina 1mg";

    @BeforeEach
    void setUp() {
        categoria = CategoriaInsumo.builder()
                .nombre(NOMBRE_CATEGORIA)
                .color(COLOR_CATEGORIA)
                .build();
        categoria.setId(10L);

        insumo = Insumo.builder()
                .nombre(NOMBRE_INSUMO)
                .categoria(categoria)
                .puntoControl(20)
                .critico(true)
                .build();
        insumo.setId(1L);

        requestDTO = new InsumoRequestDTO(NOMBRE_INSUMO, 10L, 20, true, false, null);
    }

    @Test
    void listarTodos_ok() {
        when(insumoRepository.findAllByEliminadoIsFalse()).thenReturn(List.of(insumo));

        List<InsumoDTO> resultado = insumoService.listarTodos();

        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals(NOMBRE_INSUMO, resultado.get(0).getNombre());
        verify(insumoRepository, times(1)).findAllByEliminadoIsFalse();
    }

    @Test
    void listarCriticos_ok() {
        when(insumoRepository.findByCriticoIsTrueAndEliminadoIsFalse()).thenReturn(List.of(insumo));

        List<InsumoDTO> resultado = insumoService.listarCriticos();

        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertTrue(resultado.get(0).isCritico());
        verify(insumoRepository, times(1)).findByCriticoIsTrueAndEliminadoIsFalse();
    }

    @Test
    void listarPorCategoria_ok() {
        when(insumoRepository.findByCategoriaIdAndEliminadoIsFalse(10L)).thenReturn(List.of(insumo));

        List<InsumoDTO> resultado = insumoService.listarPorCategoria(10L);

        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals(NOMBRE_CATEGORIA, resultado.get(0).getCategoria());
        verify(insumoRepository, times(1)).findByCategoriaIdAndEliminadoIsFalse(10L);
    }

    @Test
    void obtenerPorId_ok() {
        when(insumoRepository.findById(1L)).thenReturn(Optional.of(insumo));

        InsumoDTO resultado = insumoService.obtenerPorId(1L);

        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        assertEquals(NOMBRE_INSUMO, resultado.getNombre());
        verify(insumoRepository, times(1)).findById(1L);
    }

    @Test
    void obtenerPorId_errorNoEncontrado() {
        when(insumoRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> insumoService.obtenerPorId(1L));
        verify(insumoRepository, times(1)).findById(1L);
    }

    @Test
    void crearInsumo_ok() {
        when(categoriaRepository.findByIdAndEliminadoIsFalse(10L)).thenReturn(Optional.of(categoria));
        when(insumoRepository.save(any(Insumo.class))).thenReturn(insumo);

        InsumoDTO resultado = insumoService.crearInsumo(requestDTO);

        assertNotNull(resultado);
        assertEquals(NOMBRE_INSUMO, resultado.getNombre());
        verify(categoriaRepository, times(1)).findByIdAndEliminadoIsFalse(10L);
        verify(insumoRepository, times(1)).save(any(Insumo.class));
    }

    @Test
    void crearInsumo_errorCategoriaNoEncontrada() {
        when(categoriaRepository.findByIdAndEliminadoIsFalse(10L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> insumoService.crearInsumo(requestDTO));
        verify(categoriaRepository, times(1)).findByIdAndEliminadoIsFalse(10L);
        verify(insumoRepository, never()).save(any(Insumo.class));
    }

    @Test
    void crearInsumo_errorNombreDuplicado() {
        when(insumoRepository.existsByNombreIgnoreCaseAndEliminadoIsFalse(NOMBRE_INSUMO)).thenReturn(true);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> insumoService.crearInsumo(requestDTO));

        assertEquals("Ya existe un insumo con ese nombre", ex.getMessage());
        verify(categoriaRepository, never()).findByIdAndEliminadoIsFalse(anyLong());
        verify(insumoRepository, never()).save(any(Insumo.class));
    }

    @Test
    void actualizarInsumo_ok_conCategoria() {
        when(insumoRepository.findById(1L)).thenReturn(Optional.of(insumo));
        when(categoriaRepository.findByIdAndEliminadoIsFalse(10L)).thenReturn(Optional.of(categoria));
        when(insumoRepository.save(any(Insumo.class))).thenReturn(insumo);

        InsumoDTO resultado = insumoService.actualizarInsumo(1L, requestDTO);

        assertNotNull(resultado);
        assertEquals(NOMBRE_INSUMO, resultado.getNombre());
        verify(insumoRepository, times(1)).findById(1L);
        verify(categoriaRepository, times(1)).findByIdAndEliminadoIsFalse(10L);
        verify(insumoRepository, times(1)).save(insumo);
    }

    @Test
    void actualizarInsumo_errorNombreDuplicado() {
        when(insumoRepository.existsByNombreIgnoreCaseAndEliminadoIsFalseAndIdNot(NOMBRE_INSUMO, 1L)).thenReturn(true);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> insumoService.actualizarInsumo(1L, requestDTO));

        assertEquals("Ya existe un insumo con ese nombre", ex.getMessage());
        verify(insumoRepository, never()).findById(anyLong());
        verify(insumoRepository, never()).save(any(Insumo.class));
    }

    @Test
    void actualizarInsumo_ok_sinCategoria() {
        InsumoRequestDTO requestSinCategoria = new InsumoRequestDTO(NOMBRE_INSUMO, null, 20, true, false, null);
        when(insumoRepository.findById(1L)).thenReturn(Optional.of(insumo));
        when(insumoRepository.save(any(Insumo.class))).thenReturn(insumo);

        InsumoDTO resultado = insumoService.actualizarInsumo(1L, requestSinCategoria);

        assertNotNull(resultado);
        verify(insumoRepository, times(1)).findById(1L);
        verify(categoriaRepository, never()).findByIdAndEliminadoIsFalse(anyLong());
        verify(insumoRepository, times(1)).save(insumo);
    }

    @Test
    void actualizarInsumo_errorInsumoNoEncontrado() {
        when(insumoRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> insumoService.actualizarInsumo(1L, requestDTO));
        verify(insumoRepository, times(1)).findById(1L);
        verify(insumoRepository, never()).save(any(Insumo.class));
    }

    @Test
    void actualizarInsumo_errorCategoriaNoEncontrada() {
        when(insumoRepository.findById(1L)).thenReturn(Optional.of(insumo));
        when(categoriaRepository.findByIdAndEliminadoIsFalse(10L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> insumoService.actualizarInsumo(1L, requestDTO));
        verify(insumoRepository, times(1)).findById(1L);
        verify(categoriaRepository, times(1)).findByIdAndEliminadoIsFalse(10L);
        verify(insumoRepository, never()).save(any(Insumo.class));
    }

    @Test
    void eliminarPorId_ok() {
        when(insumoRepository.findById(1L)).thenReturn(Optional.of(insumo));

        insumoService.eliminarPorId(1L);

        assertTrue(insumo.isEliminado());
        verify(insumoRepository, times(1)).findById(1L);
        verify(insumoRepository, times(1)).save(insumo);
    }

    @Test
    void eliminarPorId_errorNoEncontrado() {
        when(insumoRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> insumoService.eliminarPorId(1L));
        verify(insumoRepository, times(1)).findById(1L);
        verify(insumoRepository, never()).save(any(Insumo.class));
    }
}
