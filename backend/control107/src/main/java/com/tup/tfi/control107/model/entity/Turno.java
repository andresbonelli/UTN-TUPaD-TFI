package com.tup.tfi.control107.model.entity;

import com.tup.tfi.control107.model.enums.EstadoTurno;
import com.tup.tfi.control107.model.enums.HorarioTurno;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoTurno estado;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ambulancia_id", nullable = false)
    private Ambulancia ambulancia;

    @Builder.Default
    @OneToMany(mappedBy = "turno", cascade = CascadeType.ALL)
    private Set<UsoInsumo> usosInsumo = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "chofer_id")
    private Usuario chofer;

    @ManyToOne
    @JoinColumn(name = "enfermero_id")
    private Usuario enfermero;

    @ManyToOne
    @JoinColumn(name = "medico_id")
    private Usuario medico;

    @ManyToOne
    @JoinColumn(name = "admin_id")
    private Usuario admin;


}
