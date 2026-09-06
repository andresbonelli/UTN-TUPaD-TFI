package com.tup.tfi.control107.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "insumos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Insumo extends BaseEntity {

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String categoria; // Farmacológicos, Vía Aérea, Descartables, Oxígeno, Curación, Equipamiento

    @Column(name = "punto_de_control", nullable = false)
    private Integer puntoDeControl; // Cantidad baseline esperada

    @Builder.Default
    @Column(name = "es_critico", nullable = false)
    private Boolean esCritico = false;
}
