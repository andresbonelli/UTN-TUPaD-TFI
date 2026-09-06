package com.tup.tfi.control107.repository;

import com.tup.tfi.control107.model.entity.Insumo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InsumoRepository extends JpaRepository<Insumo, Long> {
    List<Insumo> findByCategoria(String categoria);
    List<Insumo> findByEsCriticoTrue();
}
