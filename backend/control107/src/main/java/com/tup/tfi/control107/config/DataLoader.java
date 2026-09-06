package com.tup.tfi.control107.config;

import com.tup.tfi.control107.model.entity.*;
import com.tup.tfi.control107.model.enums.*;
import com.tup.tfi.control107.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final AmbulanciaRepository ambulanciaRepository;
    private final InsumoRepository insumoRepository;
    private final TurnoGuardiaRepository turnoGuardiaRepository;
    private final ControlIngresoRepository controlIngresoRepository;
    private final ControlEgresoRepository controlEgresoRepository;
    private final InconsistenciaTicketRepository inconsistenciaTicketRepository;

    @Override
    public void run(String... args) {
        if (usuarioRepository.count() > 0) {
            return; // Ya existen datos
        }

        // 1. Cargar Usuarios
        Usuario admin = usuarioRepository.save(Usuario.builder()
                .nombre("Hugo")
                .apellido("Catalán")
                .dni("30111222")
                .email("hugo.catalan@emergencias107.gob.ar")
                .rol(RolUsuario.ADMINISTRADOR)
                .activo(true)
                .build());

        Usuario enfermero = usuarioRepository.save(Usuario.builder()
                .nombre("Andrés")
                .apellido("Bonelli")
                .dni("32333444")
                .email("andres.bonelli@emergencias107.gob.ar")
                .rol(RolUsuario.ENFERMERO)
                .activo(true)
                .build());

        Usuario medico = usuarioRepository.save(Usuario.builder()
                .nombre("Matías")
                .apellido("Carro")
                .dni("34555666")
                .email("matias.carro@emergencias107.gob.ar")
                .rol(RolUsuario.MEDICO)
                .activo(true)
                .build());

        Usuario chofer = usuarioRepository.save(Usuario.builder()
                .nombre("Juan")
                .apellido("Pérez")
                .dni("28999888")
                .email("juan.perez@emergencias107.gob.ar")
                .rol(RolUsuario.CHOFER)
                .activo(true)
                .build());

        // 2. Cargar Ambulancias (matching identidad-visual-107.html)
        Ambulancia m01 = ambulanciaRepository.save(Ambulancia.builder()
                .nroMovil("MÓVIL 01")
                .patente("AE 107 AB")
                .codigoQR("QR-MOVIL-01")
                .estado(EstadoAmbulancia.APTA)
                .presionOxigenoPsi(2000)
                .kilometrajeActual(45000.0)
                .build());

        Ambulancia m02 = ambulanciaRepository.save(Ambulancia.builder()
                .nroMovil("MÓVIL 02")
                .patente("AE 107 CD")
                .codigoQR("QR-MOVIL-02")
                .estado(EstadoAmbulancia.REVISAR)
                .presionOxigenoPsi(1200)
                .kilometrajeActual(62000.0)
                .build());

        Ambulancia m03 = ambulanciaRepository.save(Ambulancia.builder()
                .nroMovil("MÓVIL 03")
                .patente("AE 107 EF")
                .codigoQR("QR-MOVIL-03")
                .estado(EstadoAmbulancia.APTA)
                .presionOxigenoPsi(2100)
                .kilometrajeActual(28000.0)
                .build());

        Ambulancia m04 = ambulanciaRepository.save(Ambulancia.builder()
                .nroMovil("MÓVIL 04")
                .patente("AE 107 GH")
                .codigoQR("QR-MOVIL-04")
                .estado(EstadoAmbulancia.CON_PROBLEMAS)
                .presionOxigenoPsi(850) // Alerta de Oxígeno Bajo en prototipo
                .kilometrajeActual(89000.0)
                .build());

        // 3. Cargar Catálogo de Insumos
        Insumo adrenalina = insumoRepository.save(Insumo.builder().nombre("Adrenalina 1mg").categoria("Farmacológicos").puntoDeControl(20).esCritico(false).build());
        Insumo atropina = insumoRepository.save(Insumo.builder().nombre("Atropina 1mg").categoria("Farmacológicos").puntoDeControl(5).esCritico(false).build());
        Insumo gasas = insumoRepository.save(Insumo.builder().nombre("Gasas Estériles (Sobres)").categoria("Curación").puntoDeControl(30).esCritico(false).build());
        Insumo guantes = insumoRepository.save(Insumo.builder().nombre("Guantes de Nitrilo M").categoria("Descartables").puntoDeControl(100).esCritico(false).build());
        Insumo tuboO2Portatil = insumoRepository.save(Insumo.builder().nombre("Tubo O2 Portátil 415L").categoria("Vía aérea").puntoDeControl(2).esCritico(true).build());
        Insumo tuboO2Pesado = insumoRepository.save(Insumo.builder().nombre("Tubo O2 Pesado 3m³").categoria("Oxígeno").puntoDeControl(1).esCritico(true).build());

        // 4. Crear Turno de Guardia
        TurnoGuardia turno = turnoGuardiaRepository.save(TurnoGuardia.builder()
                .fecha(LocalDate.now())
                .horaInicio("07:00")
                .horaFin("19:00")
                .estado(EstadoTurno.EN_CURSO)
                .creadoPorAdmin(admin)
                .ambulancia(m04)
                .personalAsignado(Set.of(enfermero, medico, chofer))
                .build());

        // 5. Simular Cierre de Turno Anterior (Egreso)
        ControlEgreso egresoAnterior = controlEgresoRepository.save(ControlEgreso.builder()
                .fechaHora(LocalDateTime.now().minusHours(12))
                .observacionesFinales("Turno entregado con 30 sobres de gasas.")
                .turnoGuardia(turno)
                .enfermero(enfermero)
                .build());

        // Detalle de Egreso
        egresoAnterior.getDetalles().add(DetalleStockEgreso.builder()
                .controlEgreso(egresoAnterior)
                .insumo(gasas)
                .cantidadDejada(30)
                .build());
        controlEgresoRepository.save(egresoAnterior);

        // 6. Simular Control de Ingreso del Siguiente Turno (con inconsistencia en gasas)
        ControlIngreso ingresoNuevo = ControlIngreso.builder()
                .fechaHora(LocalDateTime.now().minusHours(1))
                .hayFaltantes(true)
                .aptoParaSalir(true)
                .observacionProblema("Faltan 2 sobres de gasas respecto a lo entregado por la guardia anterior.")
                .turnoGuardia(turno)
                .enfermero(enfermero)
                .build();

        ingresoNuevo.getDetalles().add(DetalleStockIngreso.builder()
                .controlIngreso(ingresoNuevo)
                .insumo(gasas)
                .cantidadRecibida(28) // Dejó 30, recibió 28 -> Diferencia -2
                .faltanteCalculado(2)
                .build());

        controlIngresoRepository.save(ingresoNuevo);

        // 7. Crear Ticket de Inconsistencia para Notificación al Admin (matching prototype)
        inconsistenciaTicketRepository.save(InconsistenciaTicket.builder()
                .fechaHoraDeteccion(LocalDateTime.now().minusMinutes(45))
                .controlIngreso(ingresoNuevo)
                .controlEgresoAnterior(egresoAnterior)
                .insumo(gasas)
                .cantidadDejadaAnterior(30)
                .cantidadRecibidaActual(28)
                .diferencia(-2)
                .estado(EstadoTicket.PENDIENTE)
                .observacionesAdmin("Móvil 04: Diferencia de 2 sobres de gasas sin justificar entre turnos.")
                .build());

        inconsistenciaTicketRepository.save(InconsistenciaTicket.builder()
                .fechaHoraDeteccion(LocalDateTime.now().minusMinutes(20))
                .controlIngreso(ingresoNuevo)
                .controlEgresoAnterior(egresoAnterior)
                .insumo(tuboO2Pesado)
                .cantidadDejadaAnterior(1)
                .cantidadRecibidaActual(1)
                .diferencia(0)
                .estado(EstadoTicket.PENDIENTE)
                .observacionesAdmin("Móvil 04: Oxígeno Bajo registrado (850 psi). Se requiere verificación de tubo.")
                .build());
    }
}
