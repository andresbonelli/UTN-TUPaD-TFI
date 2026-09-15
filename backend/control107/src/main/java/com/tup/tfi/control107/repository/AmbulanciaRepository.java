package com.tup.tfi.control107.repository;

import com.tup.tfi.control107.model.entity.Ambulancia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface AmbulanciaRepository extends JpaRepository<Ambulancia, Long> {
    @Override
    @Query("SELECT a FROM Ambulancia a WHERE a.eliminado = false")
    List<Ambulancia> findAll();
}
