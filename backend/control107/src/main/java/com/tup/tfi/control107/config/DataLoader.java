package com.tup.tfi.control107.config;

import com.tup.tfi.control107.dto.UsuarioDTO;
import com.tup.tfi.control107.dto.request.IngresoEgresoDTO;
import com.tup.tfi.control107.dto.request.ControlInsumoRequestDTO;
import com.tup.tfi.control107.dto.request.TurnoRequestDTO;
import com.tup.tfi.control107.dto.request.UsuarioRequestDTO;
import com.tup.tfi.control107.model.entity.*;
import com.tup.tfi.control107.model.enums.*;
import com.tup.tfi.control107.repository.*;
import com.tup.tfi.control107.service.TurnoService;
import com.tup.tfi.control107.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

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

    @Override
    public void run(String... args) {
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

        // 2.Cargar Categorias
        CategoriaInsumo farma = categoriaRepository.save(CategoriaInsumo.builder().nombre("FARMACOLOGICOS").color("#D9574C").build());
        CategoriaInsumo  descartables = categoriaRepository.save(CategoriaInsumo.builder().nombre("DESCARTABLES").color("#087E8B").build());
        CategoriaInsumo  viaAerea = categoriaRepository.save(CategoriaInsumo.builder().nombre("VIA AEREA").color("#3978A8").build());
        CategoriaInsumo  oxigeno = categoriaRepository.save(CategoriaInsumo.builder().nombre("OXIGENO").color("#E47828").build());
        CategoriaInsumo  curacion = categoriaRepository.save(CategoriaInsumo.builder().nombre("CURACION").color("#087E8B").build());
        CategoriaInsumo  equipamiento = categoriaRepository.save(CategoriaInsumo.builder().nombre("EQUIPAMIENTO").color("#3978A8").build());

        // 3. Cargar Catálogo de Insumos
        Insumo adrenalina = insumoRepository.save(Insumo.builder().nombre("Adrenalina 1mg").categoria(farma).puntoControl(20).critico(false).build());
        Insumo atropina = insumoRepository.save(Insumo.builder().nombre("Atropina 1mg").categoria(farma).puntoControl(5).critico(false).build());
        Insumo gasas = insumoRepository.save(Insumo.builder().nombre("Gasas Estériles (Sobres)").categoria(curacion).puntoControl(30).critico(false).build());
        Insumo guantes = insumoRepository.save(Insumo.builder().nombre("Guantes de Nitrilo M").categoria(descartables).puntoControl(100).critico(false).build());
        Insumo tuboO2Portatil = insumoRepository.save(Insumo.builder().nombre("Tubo Portátil Presion de oxigeno medido en bares").categoria(viaAerea).puntoControl(60).critico(true).build());
        Insumo tuboO2Pesado = insumoRepository.save(Insumo.builder().nombre("Tubo grande Presion de oxigeno, medido en Bares").categoria(oxigeno).puntoControl(60).critico(true).build());

        var insumos = List.of(adrenalina, atropina, gasas, guantes, tuboO2Portatil, tuboO2Pesado);
        var insumosSet = Set.of(adrenalina, atropina, gasas, guantes, tuboO2Portatil, tuboO2Pesado);

        // 4. Cargar Ambulancias
        Ambulancia m01 = crearAmbulanciaConInsumos("AE 107 AB", insumosSet);
        Ambulancia m02 = crearAmbulanciaConInsumos("AE 107 CD", insumosSet);
        Ambulancia m03 = crearAmbulanciaConInsumos("AE 107 EF", insumosSet);
        Ambulancia m04 = crearAmbulanciaConInsumos("AE 107 GH", insumosSet);


        // 5. Crear Turno de Guardia
        TurnoRequestDTO turnoReq1 = new TurnoRequestDTO();
        turnoReq1.setEnfermeroId(enfermero.getId());
        turnoReq1.setAmbulanciaId(m04.getId());
        turnoReq1.setNombreChofer(chofer);
        turnoReq1.setNombreMedico(medico);
        turnoReq1.setFecha(LocalDate.now());
        turnoReq1.setHorario(HorarioTurno.MANIANA);

        var turnoResp1 = turnoService.crearTurno(admin.getId(),turnoReq1);
        // Simular ingreso y egreso
        var listaInsumosIngreso1 = insumos.stream().map(i -> new ControlInsumoRequestDTO(i.getId(),i.getPuntoControl(), null)).toList();
        listaInsumosIngreso1.get(5).setCantidad(50);
        turnoService.registrarIngreso(new IngresoEgresoDTO(turnoResp1.getId(), listaInsumosIngreso1, null));

        var listaInsumosEgreso1 = List.copyOf(listaInsumosIngreso1);
        listaInsumosEgreso1.get(0).setCantidad(listaInsumosEgreso1.get(0).getCantidad() - 1);
        listaInsumosEgreso1.get(1).setCantidad(listaInsumosEgreso1.get(1).getCantidad() - 2);
        listaInsumosEgreso1.get(5).setCantidad(100);
        turnoService.registrarEgreso(new IngresoEgresoDTO(turnoResp1.getId(), listaInsumosEgreso1, null));

        TurnoRequestDTO turnoReq2 = new TurnoRequestDTO();
        turnoReq2.setEnfermeroId(enfermero.getId());
        turnoReq2.setAmbulanciaId(m04.getId());
        turnoReq2.setNombreChofer(chofer);
        turnoReq2.setNombreMedico(medico);
        turnoReq2.setFecha(LocalDate.now());
        turnoReq2.setHorario(HorarioTurno.TARDE);

        var turnoResp2 = turnoService.crearTurno(admin.getId(),turnoReq2);

        // Simular ingreso con inconsistencia en adrenalina
        var listaInsumosIngreso2 = insumos.stream().map(i -> new ControlInsumoRequestDTO(i.getId(),i.getPuntoControl(),0)).toList();
        listaInsumosIngreso2.get(0).setCantidad(listaInsumosIngreso2.get(0).getCantidad() - 10);

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
