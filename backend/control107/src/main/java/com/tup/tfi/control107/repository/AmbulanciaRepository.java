package com.tup.tfi.control107.repository;

import com.tup.tfi.control107.model.entity.Ambulancia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface AmbulanciaRepository extends JpaRepository<Ambulancia, Long> {
    List<Ambulancia> findAllByEliminadoIsFalse();

    Optional<Ambulancia> findByIdAndEliminadoIsFalse(Long ambulanciaId);

    boolean existsByPatenteIgnoreCaseAndEliminadoIsFalse(String patente);

    boolean existsByPatenteIgnoreCaseAndEliminadoIsFalseAndIdNot(String patente, Long id);
}
