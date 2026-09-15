package com.tup.tfi.control107.model.entity;

import com.tup.tfi.control107.model.enums.RolUsuario;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario extends BaseEntity {

    @Column(nullable = false)
    private String nombre;

    @Column(unique = true, nullable = false)
    private String dni;

    @Column(unique = true, nullable = false)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RolUsuario rol;

    @Embedded
    private Clave clave;

    @Builder.Default
    @Column(nullable = false)
    private boolean activo = true;

    @Table(name = "usuario_clave")
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Clave {

        @Column(nullable = true)
        private String hash;

        @Column(nullable = true)
        private String salt;

    }
}
