package com.tup.tfi.control107.service.impl;

import com.tup.tfi.control107.dto.AmbulanciaDTO;
import com.tup.tfi.control107.dto.request.AmbulanciaRequestDTO;
import com.tup.tfi.control107.model.entity.Ambulancia;
import com.tup.tfi.control107.model.entity.Insumo;
import com.tup.tfi.control107.repository.AmbulanciaRepository;
import com.tup.tfi.control107.repository.InsumoRepository;
import com.tup.tfi.control107.service.AmbulanciaService;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AmbulanciaServiceImpl extends AbstractService<Ambulancia> implements AmbulanciaService {

    private final AmbulanciaRepository repository;
    private final InsumoRepository insumoRepository;

    public AmbulanciaServiceImpl(AmbulanciaRepository ambulanciaRepository, InsumoRepository insumoRepository) {
        super(ambulanciaRepository, Ambulancia.class);
        this.repository = ambulanciaRepository;
        this.insumoRepository = insumoRepository;
    }

    @Override
    public List<AmbulanciaDTO> listarTodas() {
        return repository.findAll().stream().map(AmbulanciaDTO::new).toList();
    }

    @Override
    public AmbulanciaDTO obtenerPorId(Long id) {
        Ambulancia a = obtener(id);
        return new AmbulanciaDTO(a);
    }

    @Transactional
    @Override
    public AmbulanciaDTO crearAmbulancia(AmbulanciaRequestDTO request) {
        var insumos = obtenerInsumos(request);
        Ambulancia guardada = repository.save(request.toAmbulancia(insumos));
        return new AmbulanciaDTO(guardada);
    }

    @Transactional
    @Override
    public AmbulanciaDTO actualizarAmbulancia(Long id, AmbulanciaRequestDTO request) {
        Ambulancia a = obtener(id);
        var insumos = request.getInsumos() != null ? obtenerInsumos(request) : null;
        request.aplicar(a, insumos);
        repository.save(a);
        return new AmbulanciaDTO(a);
    }

    @Transactional
    @Override
    public void eliminarPorId(Long id) {
        eliminar(id);
    }

    private @NonNull Set<Insumo> obtenerInsumos(AmbulanciaRequestDTO request) {
        return request.getInsumos().stream()
                .map(i -> insumoRepository.findByIdAndEliminadoIsFalse(i)
                        .orElseThrow(() -> new NoSuchElementException("No se encontró el insumo con id " + i)))
                .collect(Collectors.toSet());
    }
}
