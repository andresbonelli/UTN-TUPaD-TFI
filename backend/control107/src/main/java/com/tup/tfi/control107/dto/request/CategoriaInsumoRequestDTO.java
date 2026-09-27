package com.tup.tfi.control107.dto.request;

import com.tup.tfi.control107.model.entity.CategoriaInsumo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoriaInsumoRequestDTO {
    private String nombre;
    private String color;

    public CategoriaInsumo toCategoriaInsumo() {
        return CategoriaInsumo.builder()
                .nombre(nombre)
                .color(color)
                .build();
    }

    public void aplicar(CategoriaInsumo c) {
        if (null != nombre) {
            c.setNombre(nombre);
        }
        if (null != color) {
            c.setColor(color);
        }
        c.setUpdatedAt(LocalDateTime.now());
    }
}
