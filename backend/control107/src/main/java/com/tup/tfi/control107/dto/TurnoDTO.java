package com.tup.tfi.control107.dto;

import com.tup.tfi.control107.model.entity.*;
import com.tup.tfi.control107.model.enums.EstadoTurno;
import com.tup.tfi.control107.model.enums.HorarioTurno;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TurnoDTO {
    private Long id;
    private LocalDate fecha;
    private HorarioTurno horario;
    private EstadoTurno estado;
    private UsuarioDTO admin;
    private UsuarioDTO enfermero;
    private String medico;
    private String chofer;
    private AmbulanciaDTO ambulancia;
    private String observacionesIngreso;
    private String observacionesEgreso;
    private Set<ControlInsumoDTO> controlInsumos;

    public TurnoDTO(Turno t) {
        if (null == t) return;
        this.id = t.getId();
        this.fecha = t.getFecha();
        this.horario = t.getHorario();
        this.estado = t.getEstado();
        this.chofer = t.getNombreChofer();
        this.medico = t.getNombreMedico();
        this.observacionesIngreso = t.getObservacionesIngreso();
        this.observacionesEgreso = t.getObservacionesEgreso();
        if (t.getEnfermero() != null) {
            this.enfermero = new UsuarioDTO(t.getEnfermero());
        }
        if (t.getAdmin() != null) {
            this.admin = new UsuarioDTO(t.getAdmin());
        }
        if (t.getAmbulancia() != null) {
            this.ambulancia = new AmbulanciaDTO(t.getAmbulancia());
        }
        if (t.getControlInsumos() != null) {
            this.controlInsumos = t.getControlInsumos().stream()
                    .map(ControlInsumoDTO::new)
                    .collect(Collectors.toSet());
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ControlInsumoDTO {
        private String nombre;
        private String categoria;
        private boolean esCritico;
        private int cantidadIngreso;
        private Integer cantidadEgreso;
        private int ingresoFaltante;
        private Integer cantidadUsada;

        public ControlInsumoDTO(ControlInsumo controlInsumo) {
            if (null == controlInsumo) return;
            this.nombre = controlInsumo.getInsumo().getNombre();
            this.categoria = controlInsumo.getInsumo().getCategoria().getNombre();
            this.esCritico = controlInsumo.getInsumo().isCritico();
            this.cantidadIngreso = controlInsumo.getCantidadIngreso();
            this.cantidadEgreso = controlInsumo.getCantidadEgreso();
            this.ingresoFaltante = controlInsumo.getIngresoFaltante();
            this.cantidadUsada = controlInsumo.getCantidadUsada();
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UsuarioDTO {
        private Long id;
        private String email;

        public UsuarioDTO(Usuario u) {
            if (null == u) return;
            this.id = u.getId();
            this.email = u.getEmail();
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AmbulanciaDTO {
        private Long id;
        private String patente;

        public AmbulanciaDTO(Ambulancia a) {
            if (null == a) return;
            this.id = a.getId();
            this.patente = a.getPatente();
        }
    }

}
