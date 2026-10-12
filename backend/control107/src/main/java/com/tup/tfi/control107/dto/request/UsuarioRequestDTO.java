package com.tup.tfi.control107.dto.request;

import com.tup.tfi.control107.model.entity.Usuario;
import com.tup.tfi.control107.model.enums.RolUsuario;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioRequestDTO {
    private String nombre;
    private String dni;
    @Email(message = "Formato de mail inválido")
    private String email;
    private RolUsuario rol;
    private String clave;
    private boolean activo = true;

    public Usuario toUsuario(Usuario.Clave clave) {
        return Usuario.builder()
                .nombre(nombre)
                .dni(dni)
                .email(email.toLowerCase().trim())
                .rol(rol)
                .clave(clave)
                .activo(activo)
                .build();
    }

    public void aplicar(Usuario u) {
        if (null != nombre) {
            u.setNombre(nombre);
        }
        if (null != dni) {
            u.setDni(dni);
        }
        if (null != email) {
            u.setEmail(email.toLowerCase().trim());
        }
        if (null != rol) {
            u.setRol(rol);
        }
        u.setActivo(activo);
        u.setUpdatedAt(LocalDateTime.now());
    }
}
