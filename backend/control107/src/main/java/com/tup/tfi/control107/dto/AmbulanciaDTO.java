package com.tup.tfi.control107.dto;

import com.tup.tfi.control107.model.entity.Ambulancia;
import com.tup.tfi.control107.model.entity.InsumoAmbulancia;
import lombok.*;

import java.util.Set;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AmbulanciaDTO {
    private Long id;
    private String patente;
    private boolean disponible;
    private Set<InsumoDTO> insumos;

    public AmbulanciaDTO(Ambulancia a) {
        if (null == a) return;
        this.id = a.getId();
        this.patente = a.getPatente();
        this.disponible = a.isDisponible();
        if (a.getInsumos() != null) {
            this.insumos = a.getInsumos().stream()
                    .map(InsumoDTO::new)
                    .collect(Collectors.toSet());
        } else {
            this.insumos = Set.of();
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InsumoDTO {
        private Long id;
        private String nombre;
        private String categoria;
        private Integer stock;

        public InsumoDTO(InsumoAmbulancia i) {
            if (null == i) return;
            this.id = i.getId();
            this.stock = i.getStock();
            if (i.getInsumo() != null) {
                this.nombre = i.getInsumo().getNombre();
                if (i.getInsumo().getCategoria() != null) {
                    this.categoria = i.getInsumo().getCategoria().getNombre();
                }
            }
        }
    }
}
