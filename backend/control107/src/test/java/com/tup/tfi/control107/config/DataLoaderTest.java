package com.tup.tfi.control107.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tup.tfi.control107.dto.TurnoDTO;
import com.tup.tfi.control107.dto.UsuarioDTO;
import com.tup.tfi.control107.model.entity.Ambulancia;
import com.tup.tfi.control107.model.entity.CategoriaInsumo;
import com.tup.tfi.control107.model.entity.Insumo;
import com.tup.tfi.control107.repository.AmbulanciaRepository;
import com.tup.tfi.control107.repository.CategoriaRepository;
import com.tup.tfi.control107.repository.InsumoRepository;
import com.tup.tfi.control107.repository.UsuarioRepository;
import com.tup.tfi.control107.service.TurnoService;
import com.tup.tfi.control107.service.UsuarioService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DataLoaderTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private UsuarioService usuarioService;

    @Mock
    private CategoriaRepository categoriaRepository;

    @Mock
    private InsumoRepository insumoRepository;

    @Mock
    private AmbulanciaRepository ambulanciaRepository;

    @Mock
    private TurnoService turnoService;

    @Spy
    private ObjectMapper objectMapper = new ObjectMapper();

    @InjectMocks
    private DataLoader dataLoader;

    @Test
    @DisplayName("DataLoader carga correctamente categorias e insumos desde JSON")
    void testDataLoaderRunCargaCategoriasEInsumos() throws Exception {
        when(usuarioRepository.count()).thenReturn(0L);

        when(usuarioService.crearUsuario(any())).thenAnswer(invocation -> {
            var req = invocation.getArgument(0, com.tup.tfi.control107.dto.request.UsuarioRequestDTO.class);
            return new UsuarioDTO(1L, req.getNombre(), req.getDni(), req.getEmail(), req.getRol(), true);
        });

        when(categoriaRepository.save(any(CategoriaInsumo.class))).thenAnswer(invocation -> {
            CategoriaInsumo c = invocation.getArgument(0);
            c.setId(10L);
            return c;
        });

        when(insumoRepository.saveAll(any())).thenAnswer(invocation -> {
            List<Insumo> list = invocation.getArgument(0);
            long id = 1L;
            for (Insumo i : list) {
                i.setId(id++);
            }
            return list;
        });

        when(ambulanciaRepository.save(any(Ambulancia.class))).thenAnswer(invocation -> {
            Ambulancia a = invocation.getArgument(0);
            a.setId(100L);
            return a;
        });

        when(turnoService.crearTurno(any())).thenAnswer(invocation -> {
            TurnoDTO resp = new TurnoDTO();
            resp.setId(50L);
            return resp;
        });

        dataLoader.run();

        // Verificar categorías (deben ser 6 según la planilla de control)
        verify(categoriaRepository, times(6)).save(any(CategoriaInsumo.class));

        // Verificar insumos (deben ser 138 insumos)
        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<Insumo>> insumosCaptor = ArgumentCaptor.forClass(List.class);
        verify(insumoRepository).saveAll(insumosCaptor.capture());
        List<Insumo> insumosGuardados = insumosCaptor.getValue();
        assertThat(insumosGuardados).hasSize(138);

        // Verificar que las ambulancias se crearon con el set de insumos
        verify(ambulanciaRepository, times(4)).save(any(Ambulancia.class));

        // Verificar que se crearon los turnos
        verify(turnoService, times(2)).crearTurno(any());
        verify(turnoService, times(2)).registrarIngreso(any());
        verify(turnoService, times(1)).registrarEgreso(any());
    }

    @Test
    @DisplayName("DataLoader no hace nada si ya existen usuarios")
    void testDataLoaderNoEjecutaSiYaHayDatos() throws Exception {
        when(usuarioRepository.count()).thenReturn(5L);

        dataLoader.run();

        verify(usuarioService, never()).crearUsuario(any());
        verify(categoriaRepository, never()).save(any());
        verify(insumoRepository, never()).saveAll(any());
    }
}
