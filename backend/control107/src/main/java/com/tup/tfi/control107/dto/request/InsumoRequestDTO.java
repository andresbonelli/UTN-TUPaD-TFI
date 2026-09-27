package com.tup.tfi.control107.dto.request;

import com.tup.tfi.control107.model.entity.CategoriaInsumo;
import com.tup.tfi.control107.model.entity.Insumo;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InsumoRequestDTO {
    private String nombre;
    private Long categoriaId;
    private Integer puntoControl;
    private boolean critico;

    public Insumo toInsumo(@NotNull CategoriaInsumo categoria) {
        return new Insumo(nombre, categoria, puntoControl, critico);
    }

    public void aplicar(Insumo i, CategoriaInsumo categoria) {
        if (null != categoria) {
            i.setCategoria(categoria);
        }
        if (null != nombre) {
            i.setNombre(nombre);
        }
        if (null != puntoControl) {
            i.setPuntoControl(puntoControl);
        }
        i.setCritico(critico);
        i.setUpdatedAt(LocalDateTime.now());
    }
}
