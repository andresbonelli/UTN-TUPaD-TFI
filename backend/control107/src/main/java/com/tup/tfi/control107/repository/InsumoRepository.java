package com.tup.tfi.control107.repository;

import com.tup.tfi.control107.model.entity.Insumo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Repository
public interface InsumoRepository extends JpaRepository<Insumo, Long> {
    List<Insumo> findByCategoriaId(Long categoriaId);
    List<Insumo> findByCriticoIsTrue();
    Optional<Insumo> findByIdAndEliminadoIsFalse(Long i);
    List<Insumo> findByCategoriaIdAndEliminadoIsFalse(Long categoriaId);
}
