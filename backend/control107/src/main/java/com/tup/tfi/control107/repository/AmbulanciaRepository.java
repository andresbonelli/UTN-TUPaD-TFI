package com.tup.tfi.control107.repository;

import com.tup.tfi.control107.model.entity.Ambulancia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface AmbulanciaRepository extends JpaRepository<Ambulancia, Long> {
    List<Ambulancia> findAllByEliminadoIsFalse();

    Optional<Ambulancia> findByIdAndEliminadoIsFalse(Long ambulanciaId);

    boolean existsByPatenteIgnoreCaseAndEliminadoIsFalse(String patente);

    boolean existsByPatenteIgnoreCaseAndEliminadoIsFalseAndIdNot(String patente, Long id);

    @Query("""
    SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END
    FROM Ambulancia a
    JOIN a.insumos i
    WHERE a.eliminado = false
      AND a.disponible = true
      AND i.id = :insumoId
    """)
    boolean existeActivaConteniendoInsumo(@Param("insumoId") Long insumoId);
}
