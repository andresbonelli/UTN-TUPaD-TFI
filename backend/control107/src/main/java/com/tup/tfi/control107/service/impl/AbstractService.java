package com.tup.tfi.control107.service.impl;

import com.tup.tfi.control107.model.entity.BaseEntity;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

/**
 * Clase abstracta para evitar repetir codigo en los servicios concretos.
 * @param <T> la entidad correspondiente.
 */
abstract class AbstractService<T extends BaseEntity> {

    private final Class<T> clazz;
    private final JpaRepository<T, Long> repository;

    protected AbstractService(JpaRepository<T, Long> repository, Class<T> clazz) {
        this.repository = repository;
        this.clazz = clazz;
    }

    protected T obtener(Long id) {
        return repository.findById(id).filter(entity -> !entity.isEliminado()).orElseThrow(
                () -> new EntityNotFoundException(
                        String.format("No se encontro %s con id %d", clazz.getSimpleName(), id)
                )
        );
    }

    protected void eliminar(Long id) {
        T entity = obtener(id);
        entity.borradoLogico();
        entity.setUpdatedAt(LocalDateTime.now());
        repository.save(entity);
    }

}
