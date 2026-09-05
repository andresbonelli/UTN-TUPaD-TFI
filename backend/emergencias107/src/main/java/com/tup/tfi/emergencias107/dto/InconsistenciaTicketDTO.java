package com.tup.tfi.emergencias107.dto;

import com.tup.tfi.emergencias107.model.InconsistenciaTicket;
import com.tup.tfi.emergencias107.model.enums.EstadoTicket;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class InconsistenciaTicketDTO {
    private Long id;
    private LocalDateTime fechaHoraDeteccion;
    private String nroMovil;
    private Long insumoId;
    private String insumoNombre;
    private String insumoCategoria;
    private Integer cantidadDejadaAnterior;
    private Integer cantidadRecibidaActual;
    private Integer diferencia;
    private EstadoTicket estado;
    private String observacionesAdmin;

    public InconsistenciaTicketDTO(InconsistenciaTicket t) {
        if (null == t) return;
        this.id = t.getId();
        this.fechaHoraDeteccion = t.getFechaHoraDeteccion();
        if (t.getControlIngreso() != null && t.getControlIngreso().getTurnoGuardia() != null
                && t.getControlIngreso().getTurnoGuardia().getAmbulancia() != null) {
            this.nroMovil = t.getControlIngreso().getTurnoGuardia().getAmbulancia().getNroMovil();
        }
        this.insumoId = t.getInsumo() != null ? t.getInsumo().getId() : null;
        this.insumoNombre = t.getInsumo() != null ? t.getInsumo().getNombre() : null;
        this.insumoCategoria = t.getInsumo() != null ? t.getInsumo().getCategoria() : null;
        this.cantidadDejadaAnterior = t.getCantidadDejadaAnterior();
        this.cantidadRecibidaActual = t.getCantidadRecibidaActual();
        this.diferencia = t.getDiferencia();
        this.estado = t.getEstado();
        this.observacionesAdmin = t.getObservacionesAdmin();
    }
}
