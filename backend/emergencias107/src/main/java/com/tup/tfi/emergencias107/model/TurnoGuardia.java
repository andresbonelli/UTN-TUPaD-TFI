package com.tup.tfi.emergencias107.model;

import com.tup.tfi.emergencias107.model.enums.EstadoTurno;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "turnos_guardia")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TurnoGuardia extends BaseEntity {

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(name = "hora_inicio", nullable = false)
    private String horaInicio;

    @Column(name = "hora_fin", nullable = false)
    private String horaFin;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoTurno estado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id")
    private Usuario creadoPorAdmin;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ambulancia_id", nullable = false)
    private Ambulancia ambulancia;

    @Builder.Default
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "turno_personal",
        joinColumns = @JoinColumn(name = "turno_id"),
        inverseJoinColumns = @JoinColumn(name = "usuario_id")
    )
    private Set<Usuario> personalAsignado = new HashSet<>();
}
