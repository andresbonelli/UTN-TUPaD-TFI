package com.tup.tfi.control107.config;

import com.tup.tfi.control107.model.entity.*;
import com.tup.tfi.control107.model.enums.*;
import com.tup.tfi.control107.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Profile("dev")
public class DataLoader implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final TurnoRepository turnoRepository;
    private final CategoriaRepository categoriaRepository;
    private final InsumoRepository insumoRepository;
    private final AmbulanciaRepository ambulanciaRepository;
    private final RegistroIngresoRepository registroIngresoRepository;

    @Override
    public void run(String... args) {
        if (usuarioRepository.count() > 0) {
            return; // Ya existen datos
        }

        // 1. Cargar Usuarios
        Usuario admin = usuarioRepository.save(Usuario.builder()
                .nombre("Hugo Catalan")
                .dni("30111222")
                .email("hugo.catalan@control107.gob.ar")
                .rol(RolUsuario.ADMINISTRADOR)
                .activo(true)
                .build());

        Usuario enfermero = usuarioRepository.save(Usuario.builder()
                .nombre("Andrés Bonelli")
                .dni("32333444")
                .email("andres.bonelli@control107.gob.ar")
                .rol(RolUsuario.ENFERMERO)
                .activo(true)
                .build());

        Usuario medico = usuarioRepository.save(Usuario.builder()
                .nombre("Matías Carro")
                .dni("34555666")
                .email("matias.carro@control107.gob.ar")
                .rol(RolUsuario.MEDICO)
                .activo(true)
                .build());

        Usuario chofer = usuarioRepository.save(Usuario.builder()
                .nombre("Juan Perez")
                .dni("28999888")
                .email("juan.perez@control107.gob.ar")
                .rol(RolUsuario.CHOFER)
                .activo(true)
                .build());

        // 2.Cargar Categorias
        CategoriaInsumo farma = categoriaRepository.save(CategoriaInsumo.builder().nombre("FARMACOLOGICOS").color("#D9574C").build());
        CategoriaInsumo  descartables = categoriaRepository.save(CategoriaInsumo.builder().nombre("DESCARTABLES").color("#087E8B").build());
        CategoriaInsumo  viaAerea = categoriaRepository.save(CategoriaInsumo.builder().nombre("VIA AEREA").color("#3978A8").build());
        CategoriaInsumo  oxigeno = categoriaRepository.save(CategoriaInsumo.builder().nombre("OXIGENO").color("#E47828").build());
        CategoriaInsumo  curacion = categoriaRepository.save(CategoriaInsumo.builder().nombre("CURACION").color("#087E8B").build());
        CategoriaInsumo  equipamiento = categoriaRepository.save(CategoriaInsumo.builder().nombre("EQUIPAMIENTO").color("#3978A8").build());

        // 3. Cargar Catálogo de Insumos
        Insumo adrenalina = insumoRepository.save(Insumo.builder().nombre("Adrenalina 1mg").categoria(farma).stockBase(20).esCritico(false).build());
        Insumo atropina = insumoRepository.save(Insumo.builder().nombre("Atropina 1mg").categoria(farma).stockBase(5).esCritico(false).build());
        Insumo gasas = insumoRepository.save(Insumo.builder().nombre("Gasas Estériles (Sobres)").categoria(curacion).stockBase(30).esCritico(false).build());
        Insumo guantes = insumoRepository.save(Insumo.builder().nombre("Guantes de Nitrilo M").categoria(descartables).stockBase(100).esCritico(false).build());
        Insumo tuboO2Portatil = insumoRepository.save(Insumo.builder().nombre("Tubo O2 Portátil 415L").categoria(viaAerea).stockBase(2).esCritico(true).build());
        Insumo tuboO2Pesado = insumoRepository.save(Insumo.builder().nombre("Tubo O2 Pesado 3m³").categoria(oxigeno).stockBase(1).esCritico(true).build());

        var insumos = Set.of(adrenalina, atropina, gasas, guantes, tuboO2Portatil, tuboO2Pesado);

        // 4. Cargar Ambulancias (matching identidad-visual-107.html)
        Ambulancia m01 = crearAmbulanciaConInsumos("AE 107 AB", insumos);
        Ambulancia m02 = crearAmbulanciaConInsumos("AE 107 CD", insumos);
        Ambulancia m03 = crearAmbulanciaConInsumos("AE 107 EF", insumos);
        Ambulancia m04 = crearAmbulanciaConInsumos("AE 107 GH", insumos);


        // 5. Crear Turno de Guardia
        Turno turno = turnoRepository.save(Turno.builder()
                .fecha(LocalDate.now())
                .horario(HorarioTurno.MANIANA)
                .estado(EstadoTurno.EN_CURSO)
                .ambulancia(m04)
                .chofer(chofer)
                .enfermero(enfermero)
                .medico(medico)
                .admin(admin)
                .build());

        // 6. Simular Control de Ingreso del Siguiente Turno (con inconsistencia en gasas)
        RegistroIngreso ingresoNuevo = RegistroIngreso.builder()
                .inconsistencias(true)
                .observaciones("Faltan 2 sobres de gasas respecto a lo entregado por la guardia anterior.")
                .turno(turno)
                .enfermero(enfermero)
                .build();

        registroIngresoRepository.save(ingresoNuevo);

    }

    private Ambulancia crearAmbulanciaConInsumos(String patente, Set<Insumo> insumosBase) {
        Ambulancia amb = Ambulancia.builder()
                .patente(patente)
                .build();
        insumosBase.stream()
                .map(i -> InsumoAmbulancia.builder().insumo(i).stock(i.getStockBase()).build())
                .forEach(amb::addInsumo);
        return ambulanciaRepository.save(amb);
    }
}
