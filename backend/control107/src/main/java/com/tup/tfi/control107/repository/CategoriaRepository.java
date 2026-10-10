package com.tup.tfi.control107.repository;

import com.tup.tfi.control107.model.entity.CategoriaInsumo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoriaRepository extends JpaRepository<CategoriaInsumo, Long> {
    List<CategoriaInsumo> findAllByEliminadoIsFalse();
    Optional<CategoriaInsumo> findByIdAndEliminadoIsFalse(Long id);
}
