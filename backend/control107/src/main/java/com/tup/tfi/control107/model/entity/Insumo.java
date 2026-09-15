package com.tup.tfi.control107.model.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Representa el tipo de insumo utilizado en las ambulancias
 * y la cantidad esperada de stock que debe contener, NO es stock de deposito
 */
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

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "categoria_id", nullable = false)
    private CategoriaInsumo categoria;

    // Cantidad baseline esperada
    @Column(name = "stock_base", nullable = false)
    private Integer stockBase;

    @Builder.Default
    @Column(name = "es_critico", nullable = false)
    private boolean esCritico = false;
}
