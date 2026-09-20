package com.tup.tfi.control107.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "ambulancias")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ambulancia extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String patente;

    @Builder.Default
    @Column(nullable = false)
    private boolean disponible = true;

    /**
     * Insumos que tiene la ambulancia y la cantidad de control que deberia tener siempre
     * para empezar un turno, no es stock de deposito.
     */
    @ManyToMany
    @JoinTable(
            name = "ambulancia_insumo",
            joinColumns = @JoinColumn(name = "ambulancia_id"),
            inverseJoinColumns = @JoinColumn(name = "insumo_id")
    )
    private Set<Insumo> insumos = new HashSet<>();

    public void addInsumo(Insumo insumo) {
        this.insumos.add(insumo);
    }

    public void removeInsumo(Insumo insumo) {
        this.insumos.remove(insumo);
    }

}
