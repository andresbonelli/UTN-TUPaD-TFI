package com.tup.tfi.control107.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "registro_ingresos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegistroIngreso extends BaseEntity{

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "turno_id", nullable = false)
    private Turno turno;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enfermero_id", nullable = false)
    private Usuario enfermero;

    @Builder.Default
    @Column(nullable = false)
    private boolean inconsistencias = false;

    @Column(length = 4000)
    private String observaciones;
}
