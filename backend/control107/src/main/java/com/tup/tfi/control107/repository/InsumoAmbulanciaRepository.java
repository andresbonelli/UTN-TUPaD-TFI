package com.tup.tfi.control107.repository;

import com.tup.tfi.control107.model.entity.InsumoAmbulancia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InsumoAmbulanciaRepository extends JpaRepository<InsumoAmbulancia, Long> {
}
