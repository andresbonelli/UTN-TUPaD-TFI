package com.tup.tfi.control107.dto.request;

import com.tup.tfi.control107.model.entity.Ambulancia;
import com.tup.tfi.control107.model.entity.Insumo;
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
    private Boolean disponible = true;
    private Set<Long> insumos = Set.of();

    public Ambulancia toAmbulancia(Set<Insumo> insumos) {
        if (null == insumos) {
            throw new IllegalArgumentException("El campo insumos es obligatorio");
        }
        if (null == patente) {
            throw new IllegalArgumentException("El campo patente es obligatorio");
        }
        return new Ambulancia(patente.toUpperCase(), disponible, insumos);
    }

    public void aplicar(Ambulancia ambulancia, Set<Insumo> insumos) {
        if (null != patente) {
            ambulancia.setPatente(patente.toUpperCase());
        }
        if (null != disponible) {
            ambulancia.setDisponible(disponible);
        }
        if (null != insumos) {
            ambulancia.setInsumos(insumos);
        }
        ambulancia.setUpdatedAt(LocalDateTime.now());
    }
}
