package com.tup.tfi.control107.dto.request;

import com.tup.tfi.control107.model.entity.CategoriaInsumo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.StringUtils;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoriaInsumoRequestDTO {
    private String nombre;
    private String color;

    public CategoriaInsumo toCategoriaInsumo() {
        if (null == nombre) {
            throw new IllegalArgumentException("El campo nombre es obligatorio");
        }
        if (null == color) {
            throw new IllegalArgumentException("El campo color es obligatorio");
        }
        return CategoriaInsumo.builder()
                .nombre(StringUtils.stripAccents(nombre.toUpperCase()))
                .color(color.toUpperCase())
                .build();
    }

    public void aplicar(CategoriaInsumo c) {
        if (null != nombre) {
            c.setNombre(StringUtils.stripAccents(nombre.toUpperCase()));
        }
        if (null != color) {
            c.setColor(color.toUpperCase());
        }
        c.setUpdatedAt(LocalDateTime.now());
    }
}
