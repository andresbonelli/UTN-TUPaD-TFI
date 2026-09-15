package com.tup.tfi.control107.model.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Registro de la cantidad utilizada de un insumo en un turno de guardia
 */
@Entity
@Table(name = "uso_insumos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsoInsumo extends BaseEntity{

    @Column(name = "cantidad_usada", nullable = false)
    private Integer cantidadUsada;

    @ManyToOne
    @JoinColumn(name = "insumo_id")
    private Insumo insumo;

    @ManyToOne
    @JoinColumn(name = "turno_id")
    private Turno turno;
}
