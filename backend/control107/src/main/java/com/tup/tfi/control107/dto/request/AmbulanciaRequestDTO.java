package com.tup.tfi.control107.dto.request;

import com.tup.tfi.control107.model.entity.Ambulancia;
import com.tup.tfi.control107.model.entity.Insumo;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AmbulanciaRequestDTO {
    private String patente;
    private boolean disponible = true;
    private Set<Long> insumos = Set.of();

    public Ambulancia toAmbulancia(@NotNull Set<Insumo> insumos) {
        return new Ambulancia(patente, disponible, insumos);
    }

    public void aplicar(Ambulancia ambulancia, Set<Insumo> insumos) {
        ambulancia.setDisponible(disponible);
        if (null != insumos) {
            ambulancia.setInsumos(insumos);
        }
        ambulancia.setUpdatedAt(LocalDateTime.now());
    }
}
