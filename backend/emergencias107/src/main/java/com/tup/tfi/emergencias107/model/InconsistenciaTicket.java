package com.tup.tfi.emergencias107.model;

import com.tup.tfi.emergencias107.model.enums.EstadoTicket;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "inconsistencias_ticket")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InconsistenciaTicket extends BaseEntity {

    @Column(name = "fecha_hora_deteccion", nullable = false)
    private LocalDateTime fechaHoraDeteccion;

    @Column(name = "cantidad_dejada_anterior", nullable = false)
    private Integer cantidadDejadaAnterior;

    @Column(name = "cantidad_recibida_actual", nullable = false)
    private Integer cantidadRecibidaActual;

    @Column(nullable = false)
    private Integer diferencia;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoTicket estado;

    @Column(name = "observaciones_admin", length = 1000)
    private String observacionesAdmin;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "control_ingreso_id", nullable = false)
    private ControlIngreso controlIngreso;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "control_egreso_anterior_id", nullable = false)
    private ControlEgreso controlEgresoAnterior;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "insumo_id", nullable = false)
    private Insumo insumo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_asignado_id")
    private Usuario adminAsignado;
}
