package com.tup.tfi.control107.dto;

import com.tup.tfi.control107.model.entity.Usuario;
import com.tup.tfi.control107.model.enums.RolUsuario;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioDTO {
    private Long id;
    private String nombre;
    private String dni;
    private String email;
    private RolUsuario rol;
    private boolean activo;

    public UsuarioDTO(Usuario u) {
        if (null == u) return;
        this.id = u.getId();
        this.nombre = u.getNombre();
        this.dni = u.getDni();
        this.email = u.getEmail();
        this.rol = u.getRol();
        this.activo = u.isActivo();
    }
}
