package com.tup.tfi.control107.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "usos_insumo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsoInsumo extends BaseEntity {

    @Column(name = "fecha_hora", nullable = false)
    private LocalDateTime fechaHora;

    @Column(name = "nro_ficha_intervencion")
    private String nroFichaIntervencion;

    @Column(name = "cantidad_usada", nullable = false)
    private Integer cantidadUsada;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "turno_guardia_id", nullable = false)
    private TurnoGuardia turnoGuardia;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "insumo_id", nullable = false)
    private Insumo insumo;
}
