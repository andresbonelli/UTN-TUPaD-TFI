package com.tup.tfi.control107.service.impl;

import com.tup.tfi.control107.dto.AmbulanciaDTO;
import com.tup.tfi.control107.dto.request.AmbulanciaRequestDTO;
import com.tup.tfi.control107.model.entity.Ambulancia;
import com.tup.tfi.control107.model.entity.Insumo;
import com.tup.tfi.control107.repository.AmbulanciaRepository;
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
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AmbulanciaServiceImplTest {

    @Mock
    private AmbulanciaRepository ambulanciaRepository;

    @Mock
    private InsumoRepository insumoRepository;

    @InjectMocks
    private AmbulanciaServiceImpl ambulanciaServiceImpl;

    private Ambulancia ambulancia;
    private Insumo insumo;
    private AmbulanciaRequestDTO requestDTO;

    private static final String PATENTE = "AB123CD";

    @BeforeEach
    void setUp() {
        insumo = Insumo.builder()
                .nombre("Gasas")
                .puntoControl(10)
                .critico(false)
                .build();
        insumo.setId(100L);

        ambulancia = Ambulancia.builder()
                .patente(PATENTE)
                .disponible(true)
                .insumos(Set.of(insumo))
                .build();
        ambulancia.setId(1L);

        requestDTO = new AmbulanciaRequestDTO(PATENTE, true, Set.of(100L));
    }

    @Test
    void listarTodas_ok() {
        when(ambulanciaRepository.findAllByEliminadoIsFalse()).thenReturn(List.of(ambulancia));

        List<AmbulanciaDTO> resultado = ambulanciaServiceImpl.listarTodas();

        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals(PATENTE, resultado.get(0).getPatente());
        verify(ambulanciaRepository, times(1)).findAllByEliminadoIsFalse();
    }

    @Test
    void obtenerPorId_ok() {
        when(ambulanciaRepository.findById(1L)).thenReturn(Optional.of(ambulancia));

        AmbulanciaDTO resultado = ambulanciaServiceImpl.obtenerPorId(1L);

        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        assertEquals(PATENTE, resultado.getPatente());
        verify(ambulanciaRepository, times(1)).findById(1L);
    }

    @Test
    void obtenerPorId_errorNoEncontrada() {
        when(ambulanciaRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> ambulanciaServiceImpl.obtenerPorId(1L));
        verify(ambulanciaRepository, times(1)).findById(1L);
    }

    @Test
    void crearAmbulancia_ok() {
        when(insumoRepository.findByIdAndEliminadoIsFalse(100L)).thenReturn(Optional.of(insumo));
        when(ambulanciaRepository.save(any(Ambulancia.class))).thenReturn(ambulancia);

        AmbulanciaDTO resultado = ambulanciaServiceImpl.crearAmbulancia(requestDTO);

        assertNotNull(resultado);
        assertEquals(PATENTE, resultado.getPatente());
        verify(insumoRepository, times(1)).findByIdAndEliminadoIsFalse(100L);
        verify(ambulanciaRepository, times(1)).save(any(Ambulancia.class));
    }

    @Test
    void crearAmbulancia_errorInsumoNoEncontrado() {
        when(insumoRepository.findByIdAndEliminadoIsFalse(100L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> ambulanciaServiceImpl.crearAmbulancia(requestDTO));
        verify(insumoRepository, times(1)).findByIdAndEliminadoIsFalse(100L);
        verify(ambulanciaRepository, never()).save(any(Ambulancia.class));
    }

    @Test
    void crearAmbulancia_errorPatenteDuplicada() {
        when(ambulanciaRepository.existsByPatenteIgnoreCaseAndEliminadoIsFalse(PATENTE)).thenReturn(true);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> ambulanciaServiceImpl.crearAmbulancia(requestDTO));

        assertEquals("Ya existe una ambulancia con esa patente", ex.getMessage());
        verify(insumoRepository, never()).findByIdAndEliminadoIsFalse(anyLong());
        verify(ambulanciaRepository, never()).save(any(Ambulancia.class));
    }

    @Test
    void actualizarAmbulancia() {
        when(ambulanciaRepository.findById(1L)).thenReturn(Optional.of(ambulancia));
        when(insumoRepository.findByIdAndEliminadoIsFalse(100L)).thenReturn(Optional.of(insumo));
        when(ambulanciaRepository.save(any(Ambulancia.class))).thenReturn(ambulancia);

        AmbulanciaDTO resultado = ambulanciaServiceImpl.actualizarAmbulancia(1L, requestDTO);

        assertNotNull(resultado);
        assertEquals(PATENTE, resultado.getPatente());
        verify(ambulanciaRepository, times(1)).findById(1L);
        verify(insumoRepository, times(1)).findByIdAndEliminadoIsFalse(100L);
        verify(ambulanciaRepository, times(1)).save(ambulancia);
    }

    @Test
    void actualizarAmbulancia_errorPatenteDuplicada() {
        when(ambulanciaRepository.existsByPatenteIgnoreCaseAndEliminadoIsFalseAndIdNot(PATENTE, 1L)).thenReturn(true);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> ambulanciaServiceImpl.actualizarAmbulancia(1L, requestDTO));

        assertEquals("Ya existe una ambulancia con esa patente", ex.getMessage());
        verify(ambulanciaRepository, never()).findById(anyLong());
        verify(ambulanciaRepository, never()).save(any(Ambulancia.class));
    }

    @Test
    void actualizarAmbulancia_errorInsumoNoEncontrado() {
        when(ambulanciaRepository.findById(1L)).thenReturn(Optional.of(ambulancia));
        when(insumoRepository.findByIdAndEliminadoIsFalse(100L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> ambulanciaServiceImpl.actualizarAmbulancia(1L, requestDTO));
        verify(ambulanciaRepository, times(1)).findById(1L);
        verify(insumoRepository, times(1)).findByIdAndEliminadoIsFalse(100L);
        verify(ambulanciaRepository, never()).save(any(Ambulancia.class));
    }

    @Test
    void eliminarPorId_ok() {
        when(ambulanciaRepository.findById(1L)).thenReturn(Optional.of(ambulancia));

        ambulanciaServiceImpl.eliminarPorId(1L);

        assertTrue(ambulancia.isEliminado());
        verify(ambulanciaRepository, times(1)).findById(1L);
        verify(ambulanciaRepository, times(1)).save(ambulancia);
    }

    @Test
    void eliminarPorId_errorNoEncontrada() {
        when(ambulanciaRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> ambulanciaServiceImpl.eliminarPorId(1L));
        verify(ambulanciaRepository, times(1)).findById(1L);
        verify(ambulanciaRepository, never()).save(any(Ambulancia.class));
    }
}