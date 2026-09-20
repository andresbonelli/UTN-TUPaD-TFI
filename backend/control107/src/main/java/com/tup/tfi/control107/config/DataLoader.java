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
        Insumo tuboO2Portatil = insumoRepository.save(Insumo.builder().nombre("Tubo O2 Portátil 415L").categoria(viaAerea).puntoControl(2).critico(true).build());
        Insumo tuboO2Pesado = insumoRepository.save(Insumo.builder().nombre("Tubo O2 Pesado 3m³").categoria(oxigeno).puntoControl(1).critico(true).build());

        var insumos = Set.of(adrenalina, atropina, gasas, guantes, tuboO2Portatil, tuboO2Pesado);

        // 4. Cargar Ambulancias
        Ambulancia m01 = crearAmbulanciaConInsumos("AE 107 AB", insumos);
        Ambulancia m02 = crearAmbulanciaConInsumos("AE 107 CD", insumos);
        Ambulancia m03 = crearAmbulanciaConInsumos("AE 107 EF", insumos);
        Ambulancia m04 = crearAmbulanciaConInsumos("AE 107 GH", insumos);


        // 5. Crear Turno de Guardia
        Turno turno1 = Turno.builder()
                .fecha(LocalDate.now())
                .horario(HorarioTurno.MANIANA)
                .estado(EstadoTurno.FINALIZADO)
                .ambulancia(m04)
                .nombreChofer(chofer)
                .enfermero(enfermero)
                .nombreMedico(medico)
                .admin(admin)
                .build();
        cargarInsumosTurno(turno1);
        // Simular egreso
        turno1.getControlInsumos().forEach(ci -> ci.informarEgreso(ci.getCantidadIngreso() - 1));
        turnoRepository.save(turno1);

        Turno turno2 = Turno.builder()
                .fecha(LocalDate.now())
                .horario(HorarioTurno.MANIANA)
                .estado(EstadoTurno.FINALIZADO)
                .ambulancia(m04)
                .nombreChofer(chofer)
                .enfermero(enfermero)
                .nombreMedico(medico)
                .admin(admin)
                .build();
        cargarInsumosTurno(turno2);
        // Simular ingreso con inconsistencia en gasas
        turno2.getControlInsumos().stream()
                .filter(i -> gasas.equals(i.getInsumo()))
                .findAny().ifPresent(i -> i.informarIngreso(20));
        turnoRepository.save(turno2);
    }

    private Ambulancia crearAmbulanciaConInsumos(String patente, Set<Insumo> insumosBase) {
        Ambulancia amb = Ambulancia.builder()
                .patente(patente)
                .insumos(insumosBase)
                .build();
        return ambulanciaRepository.save(amb);
    }

    private void cargarInsumosTurno(Turno t) {
        t.setControlInsumos(t.getAmbulancia().getInsumos().stream()
                .map(i -> ControlInsumo.builder()
                        .insumo(i)
                        .turno(t)
                        .cantidadIngreso(i.getPuntoControl())
                        .ingresoFaltante(0)
                        .build())
                .toList());
    }
}
