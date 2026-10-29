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
    private Boolean critico;
    private Boolean esOxigeno;
    private Double capacidadMaxima;

    public Insumo toInsumo(CategoriaInsumo categoria) {
        // Validaciones de creacion
        if (null == categoria) {
            throw new IllegalArgumentException("El campo categoria es obligatorio");
        }
        if (null == critico) {
            throw new IllegalArgumentException("El campo critico es obligatorio");
        }
        if (null == puntoControl) {
            throw new IllegalArgumentException("El campo punto de control es obligatorio");
        }
        if (null == esOxigeno) {
            throw new IllegalArgumentException("El campo distintorio esOxigeno es obligatorio");
        }
        return new Insumo(
                nombre,
                categoria,
                puntoControl,
                esOxigeno || critico,
                esOxigeno,
                esOxigeno ? capacidadMaxima : null
        );
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
        if (null != critico) {
            i.setCritico(critico);
        }
        if (null != esOxigeno) {
            i.setOxigeno(esOxigeno);
        }
        if (null != capacidadMaxima) {
            i.setCapacidadMaxima(Boolean.TRUE.equals(esOxigeno) ? capacidadMaxima : null);
        }
        i.setUpdatedAt(LocalDateTime.now());
    }
}
