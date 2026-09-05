package com.tup.tfi.emergencias107.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "controles_egreso")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ControlEgreso extends BaseEntity{

    @Column(name = "fecha_hora", nullable = false)
    private LocalDateTime fechaHora;

    @Column(name = "observaciones_finales", length = 1000)
    private String observacionesFinales;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "turno_guardia_id", nullable = false)
    private TurnoGuardia turnoGuardia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enfermero_id", nullable = false)
    private Usuario enfermero;

    @Builder.Default
    @OneToMany(mappedBy = "controlEgreso", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetalleStockEgreso> detalles = new ArrayList<>();
}
