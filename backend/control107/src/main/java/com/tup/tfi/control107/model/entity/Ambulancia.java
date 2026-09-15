package com.tup.tfi.control107.model.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
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
     * Composición: El ciclo de vida del InsumoAmbulancia es manejado en su totalidad por la Ambulancia (Padre)
     */
    @Builder.Default
    @OneToMany(mappedBy = "ambulancia", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private Set<InsumoAmbulancia> insumos = new HashSet<>();

    public void addInsumo(InsumoAmbulancia insumoAmbulancia) {
        if (this.insumos == null) {
            this.insumos = new HashSet<>();
        }
        this.insumos.add(insumoAmbulancia);
        insumoAmbulancia.setAmbulancia(this);
    }

    public void removeInsumo(InsumoAmbulancia insumoAmbulancia) {
        if (this.insumos != null) {
            this.insumos.remove(insumoAmbulancia);
            insumoAmbulancia.setAmbulancia(null);
        }
    }
}
