package com.tup.tfi.control107.repository;

import com.tup.tfi.control107.model.entity.Ambulancia;
import com.tup.tfi.control107.model.enums.EstadoAmbulancia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AmbulanciaRepository extends JpaRepository<Ambulancia, Long> {
    Optional<Ambulancia> findByNroMovil(String nroMovil);
    Optional<Ambulancia> findByCodigoQR(String codigoQR);
    List<Ambulancia> findByEstado(EstadoAmbulancia estado);
}
