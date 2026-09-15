package com.tup.tfi.control107.dto;

import com.tup.tfi.control107.model.entity.Insumo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InsumoDTO {
    private Long id;
    private String nombre;
    private String categoria;
    private Integer stockBase;
    private boolean esCritico;

    public InsumoDTO(Insumo i) {
        if (null == i) return;
        this.id = i.getId();
        this.nombre = i.getNombre();
        this.stockBase = i.getStockBase();
        this.esCritico = i.isEsCritico();
        if (i.getCategoria() != null) {
            this.categoria = i.getCategoria().getNombre();
        } else {
            this.categoria = "SIN CATEGORIA";
        }
    }
}
