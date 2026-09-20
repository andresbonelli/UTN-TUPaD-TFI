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
    private int puntoControl;
    private boolean esCritico;

    public InsumoDTO(Insumo i) {
        if (null == i) return;
        this.id = i.getId();
        this.nombre = i.getNombre();
        this.puntoControl = i.getPuntoControl();
        this.esCritico = i.isCritico();
        if (i.getCategoria() != null) {
            this.categoria = i.getCategoria().getNombre();
        } else {
            this.categoria = "SIN CATEGORIA";
        }
    }
}
