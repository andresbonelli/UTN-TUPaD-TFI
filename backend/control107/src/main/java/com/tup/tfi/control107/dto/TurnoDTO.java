package com.tup.tfi.control107.dto;

import com.tup.tfi.control107.model.entity.Ambulancia;
import com.tup.tfi.control107.model.entity.Turno;
import com.tup.tfi.control107.model.entity.UsoInsumo;
import com.tup.tfi.control107.model.entity.Usuario;
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
    private UsuarioDTO chofer;
    private UsuarioDTO enfermero;
    private UsuarioDTO medico;
    private UsuarioDTO admin;
    private AmbulanciaDTO ambulancia;
    private String observaciones;
    private Set<UsoInsumoDTO> insumosUtilizados;

    public TurnoDTO(Turno t) {
        if (null == t) return;
        this.id = t.getId();
        this.fecha = t.getFecha();
        this.horario = t.getHorario();
        this.estado = t.getEstado();
        if (t.getChofer() != null) {
            this.chofer = new UsuarioDTO(t.getChofer());
        }
        if (t.getEnfermero() != null) {
            this.enfermero = new UsuarioDTO(t.getEnfermero());
        }
        if (t.getMedico() != null) {
            this.medico = new UsuarioDTO(t.getMedico());
        }
        if (t.getAdmin() != null) {
            this.admin = new UsuarioDTO(t.getAdmin());
        }
        if (t.getAmbulancia() != null) {
            this.ambulancia = new AmbulanciaDTO(t.getAmbulancia());
        }
        if (t.getUsosInsumo() != null) {
            this.insumosUtilizados = t.getUsosInsumo().stream()
                    .map(UsoInsumoDTO::new)
                    .collect(Collectors.toSet());
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UsoInsumoDTO {
        private InsumoDTO insumo;
        private Integer cantidadUsada;

        public UsoInsumoDTO(UsoInsumo usoInsumo) {
            if (null == usoInsumo) return;
            this.insumo = new InsumoDTO(usoInsumo.getInsumo());
            this.cantidadUsada = usoInsumo.getCantidadUsada();
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
