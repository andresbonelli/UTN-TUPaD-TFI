package com.tup.tfi.control107.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "categorias")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoriaInsumo extends BaseEntity{

    @Column(nullable = false, unique = true)
    private String nombre;

    // Hexadecimal, example: #FF0000
    @Column(nullable = false)
    private String color;
}
