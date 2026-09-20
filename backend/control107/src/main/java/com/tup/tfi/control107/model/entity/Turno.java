package com.tup.tfi.control107.model.entity;

import com.tup.tfi.control107.model.enums.EstadoTurno;
import com.tup.tfi.control107.model.enums.HorarioTurno;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "turnos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Turno extends BaseEntity {

    @Column(nullable = false)
    private LocalDate fecha;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private HorarioTurno horario;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoTurno estado = EstadoTurno.PROGRAMADO;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ambulancia_id", nullable = false)
    private Ambulancia ambulancia;

    @ManyToOne
    @JoinColumn(name = "enfermero_id")
    private Usuario enfermero;

    @ManyToOne
    @JoinColumn(name = "admin_id")
    private Usuario admin;

    @Column(name = "nombre_chofer", nullable = false)
    private String nombreChofer;

    @Column(name = "nombre_medico", nullable = false)
    private String nombreMedico;

    @Column(name = "observaciones_ingreso", columnDefinition = "TEXT", length = 1000)
    private String observacionesIngreso;

    @Column(name = "observaciones_egreso", columnDefinition = "TEXT", length = 1000)
    private String observacionesEgreso;

    /**
     * Entidad que mapea el tipo de Insumo con el control de stock al ingreso,
     * egreso, faltantes al empezar el turno y cantidad usada.
     */
    @Builder.Default
    @OneToMany(mappedBy = "turno", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ControlInsumo> controlInsumos = new ArrayList<>();
}
