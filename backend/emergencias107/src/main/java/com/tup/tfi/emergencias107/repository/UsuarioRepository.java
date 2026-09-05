package com.tup.tfi.emergencias107.repository;

import com.tup.tfi.emergencias107.model.Usuario;
import com.tup.tfi.emergencias107.model.enums.RolUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByDni(String dni);
    Optional<Usuario> findByEmail(String email);
    List<Usuario> findByRol(RolUsuario rol);
}
