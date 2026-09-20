package com.tup.tfi.control107.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AmbulanciaRequestDTO {
    private String patente;
    private boolean disponible = true;
    private Set<Long> insumos = Set.of();
}
