package com.tup.tfi.emergencias107.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "controles_ingreso")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ControlIngreso extends BaseEntity{

    @Column(name = "fecha_hora", nullable = false)
    private LocalDateTime fechaHora;

    @Column(name = "hay_faltantes", nullable = false)
    private Boolean hayFaltantes;

    @Column(name = "apto_para_salir", nullable = false)
    private Boolean aptoParaSalir;

    @Column(name = "observacion_problema", length = 1000)
    private String observacionProblema;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "turno_guardia_id", nullable = false)
    private TurnoGuardia turnoGuardia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enfermero_id", nullable = false)
    private Usuario enfermero;

    @Builder.Default
    @OneToMany(mappedBy = "controlIngreso", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetalleStockIngreso> detalles = new ArrayList<>();
}
