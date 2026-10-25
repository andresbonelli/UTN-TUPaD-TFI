package com.tup.tfi.control107.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tup.tfi.control107.dto.UsuarioDTO;
import com.tup.tfi.control107.dto.request.ControlInsumoRequestDTO;
import com.tup.tfi.control107.dto.request.IngresoEgresoDTO;
import com.tup.tfi.control107.dto.request.TurnoRequestDTO;
import com.tup.tfi.control107.dto.request.UsuarioRequestDTO;
import com.tup.tfi.control107.model.entity.*;
import com.tup.tfi.control107.model.enums.*;
import com.tup.tfi.control107.repository.*;
import com.tup.tfi.control107.service.TurnoService;
import com.tup.tfi.control107.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
@Profile("dev")
public class DataLoader implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioService usuarioService;
    private final CategoriaRepository categoriaRepository;
    private final InsumoRepository insumoRepository;
    private final AmbulanciaRepository ambulanciaRepository;
    private final TurnoService turnoService;
    private final ObjectMapper objectMapper = new ObjectMapper().disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);

    public record CategoriaSeedDTO(String nombre, String color) {}
    public record InsumoSeedDTO(String nombre, String categoria, int puntoControl, boolean critico) {}

    @Override
    public void run(String... args) throws Exception {
        if (usuarioRepository.count() > 0) {
            return; // Ya existen datos
        }

        // 1. Cargar Usuarios
        UsuarioRequestDTO adminDto = new UsuarioRequestDTO(
                "Hugo Catalan",
                "30111222",
                "hugo.catalan@control107.gob.ar",
                RolUsuario.ADMINISTRADOR,
                "1234",
                true
        );

        UsuarioRequestDTO enfermeroDto = new UsuarioRequestDTO(
                "Andrés Bonelli",
                "32333444",
                "andres.bonelli@control107.gob.ar",
                RolUsuario.ENFERMERO,
                "1234",
                true
        );

        UsuarioDTO admin = usuarioService.crearUsuario(adminDto);
        UsuarioDTO enfermero = usuarioService.crearUsuario(enfermeroDto);

        String medico = "Matías Carro";
        String chofer = "Juan Perez";

        // 2. Cargar Categorías desde JSON
        List<CategoriaSeedDTO> categoriasData;
        try (InputStream is = new ClassPathResource("data/categorias.json").getInputStream()) {
            categoriasData = objectMapper.readValue(is, new TypeReference<List<CategoriaSeedDTO>>() {});
        }

        Map<String, CategoriaInsumo> categoriaMap = new HashMap<>();
        for (CategoriaSeedDTO catDto : categoriasData) {
            CategoriaInsumo cat = categoriaRepository.save(
                    CategoriaInsumo.builder()
                            .nombre(catDto.nombre())
                            .color(catDto.color())
                            .build()
            );
            categoriaMap.put(catDto.nombre(), cat);
        }
        log.info("Cargadas {} categorías desde JSON", categoriaMap.size());

        // 3. Cargar Catálogo de Insumos desde JSON
        List<InsumoSeedDTO> insumosData;
        try (InputStream is = new ClassPathResource("data/insumos.json").getInputStream()) {
            insumosData = objectMapper.readValue(is, new TypeReference<List<InsumoSeedDTO>>() {});
        }

        List<Insumo> insumosToSave = new ArrayList<>();
        for (InsumoSeedDTO insumoDto : insumosData) {
            CategoriaInsumo cat = categoriaMap.get(insumoDto.categoria());
            if (cat == null) {
                throw new IllegalStateException("Categoría no encontrada para insumo: " + insumoDto.nombre() + " (" + insumoDto.categoria() + ")");
            }
            insumosToSave.add(
                    Insumo.builder()
                            .nombre(insumoDto.nombre())
                            .categoria(cat)
                            .puntoControl(insumoDto.puntoControl())
                            .critico(insumoDto.critico())
                            .build()
            );
        }
        List<Insumo> insumos = insumoRepository.saveAll(insumosToSave);
        log.info("Cargados {} insumos desde JSON", insumos.size());

        Set<Insumo> insumosSet = new HashSet<>(insumos);

        // 4. Cargar Ambulancias
        Ambulancia m01 = crearAmbulanciaConInsumos("AE 107 AB", insumosSet);
        Ambulancia m02 = crearAmbulanciaConInsumos("AE 107 CD", insumosSet);
        Ambulancia m03 = crearAmbulanciaConInsumos("AE 107 EF", insumosSet);
        Ambulancia m04 = crearAmbulanciaConInsumos("AE 107 GH", insumosSet);

        // 5. Crear Turno de Guardia
        TurnoRequestDTO turnoReq1 = new TurnoRequestDTO();
        turnoReq1.setAdminId(admin.getId());
        turnoReq1.setEnfermeroId(enfermero.getId());
        turnoReq1.setAmbulanciaId(m04.getId());
        turnoReq1.setNombreChofer(chofer);
        turnoReq1.setNombreMedico(medico);
        turnoReq1.setFecha(LocalDate.now());
        turnoReq1.setHorario(HorarioTurno.MANIANA);

        var turnoResp1 = turnoService.crearTurno(turnoReq1);
        // Simular ingreso y egreso
        var listaInsumosIngreso1 = insumos.stream()
                .map(i -> new ControlInsumoRequestDTO(i.getId(), i.getPuntoControl(), null))
                .collect(Collectors.toList());
        if (listaInsumosIngreso1.size() > 5) {
            listaInsumosIngreso1.get(5).setCantidad(Math.max(0, listaInsumosIngreso1.get(5).getCantidad() - 1));
        }
        turnoService.registrarIngreso(new IngresoEgresoDTO(turnoResp1.getId(), listaInsumosIngreso1, null));

        var listaInsumosEgreso1 = listaInsumosIngreso1.stream()
                .map(ci -> new ControlInsumoRequestDTO(ci.getId(), ci.getCantidad(), null))
                .collect(Collectors.toList());
        if (!listaInsumosEgreso1.isEmpty()) {
            listaInsumosEgreso1.get(0).setCantidad(Math.max(0, listaInsumosEgreso1.get(0).getCantidad() - 1));
        }
        if (listaInsumosEgreso1.size() > 1) {
            listaInsumosEgreso1.get(1).setCantidad(Math.max(0, listaInsumosEgreso1.get(1).getCantidad() - 2));
        }
        if (listaInsumosEgreso1.size() > 5) {
            listaInsumosEgreso1.get(5).setCantidad(listaInsumosEgreso1.get(5).getCantidad() + 1);
        }
        turnoService.registrarEgreso(new IngresoEgresoDTO(turnoResp1.getId(), listaInsumosEgreso1, null));

        TurnoRequestDTO turnoReq2 = new TurnoRequestDTO();
        turnoReq2.setAdminId(admin.getId());
        turnoReq2.setEnfermeroId(enfermero.getId());
        turnoReq2.setAmbulanciaId(m04.getId());
        turnoReq2.setNombreChofer(chofer);
        turnoReq2.setNombreMedico(medico);
        turnoReq2.setFecha(LocalDate.now());
        turnoReq2.setHorario(HorarioTurno.TARDE);

        var turnoResp2 = turnoService.crearTurno(turnoReq2);

        // Simular ingreso con inconsistencia en adrenalina
        var listaInsumosIngreso2 = insumos.stream()
                .map(i -> new ControlInsumoRequestDTO(i.getId(), i.getPuntoControl(), 0))
                .collect(Collectors.toList());

        Long adrenalinaId = insumos.stream()
                .filter(i -> i.getNombre().equalsIgnoreCase("Adrenalina"))
                .findFirst()
                .map(Insumo::getId)
                .orElse(insumos.get(0).getId());

        listaInsumosIngreso2.stream()
                .filter(ci -> ci.getId().equals(adrenalinaId))
                .findFirst()
                .ifPresent(ci -> ci.setCantidad(Math.max(0, ci.getCantidad() - 10)));

        turnoService.registrarIngreso(new IngresoEgresoDTO(turnoResp2.getId(), listaInsumosIngreso2, "Faltan 10 adrenalina"));
    }

    private Ambulancia crearAmbulanciaConInsumos(String patente, Set<Insumo> insumosBase) {
        Ambulancia amb = Ambulancia.builder()
                .patente(patente)
                .insumos(insumosBase)
                .build();
        return ambulanciaRepository.save(amb);
    }
}
