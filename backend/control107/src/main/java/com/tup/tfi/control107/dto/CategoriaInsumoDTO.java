package com.tup.tfi.control107.dto;

import com.tup.tfi.control107.model.entity.CategoriaInsumo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoriaInsumoDTO {
    private Long id;
    private String nombre;
    private String color;

    public CategoriaInsumoDTO(CategoriaInsumo c) {
        if (null == c) return;
        this.id = c.getId();
        this.nombre = c.getNombre();
        this.color = c.getColor();
    }
}
