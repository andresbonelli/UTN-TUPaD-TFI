package com.tup.tfi.control107.dto;

import com.tup.tfi.control107.model.entity.Ambulancia;
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
}
