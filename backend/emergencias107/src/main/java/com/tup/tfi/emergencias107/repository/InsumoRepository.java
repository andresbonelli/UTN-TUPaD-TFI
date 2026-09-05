package com.tup.tfi.emergencias107.repository;

import com.tup.tfi.emergencias107.model.Insumo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InsumoRepository extends JpaRepository<Insumo, Long> {
    List<Insumo> findByCategoria(String categoria);
    List<Insumo> findByEsCriticoTrue();
}
