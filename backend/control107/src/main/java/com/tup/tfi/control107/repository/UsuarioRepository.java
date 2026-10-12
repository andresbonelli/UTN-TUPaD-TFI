package com.tup.tfi.control107.repository;

import com.tup.tfi.control107.model.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    List<Usuario> findAllByEliminadoIsFalse();
    Optional<Usuario> findByEmailAndEliminadoIsFalse(String email);
    Optional<Usuario> findByIdAndEliminadoIsFalse(Long usuarioId);
    boolean existsByDniAndEliminadoIsFalse(String dni);
    boolean existsByDniAndEliminadoIsFalseAndIdNot(String dni, Long id);
    boolean existsByEmailIgnoreCaseAndEliminadoIsFalse(String email);
    boolean existsByEmailIgnoreCaseAndEliminadoIsFalseAndIdNot(String email, Long id);
}
