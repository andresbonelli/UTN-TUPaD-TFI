package com.tup.tfi.control107.service.impl;

import com.tup.tfi.control107.dto.AmbulanciaDTO;
import com.tup.tfi.control107.dto.request.AmbulanciaRequestDTO;
import com.tup.tfi.control107.model.entity.Ambulancia;
import com.tup.tfi.control107.model.entity.Insumo;
import com.tup.tfi.control107.repository.AmbulanciaRepository;
import com.tup.tfi.control107.repository.InsumoRepository;
import com.tup.tfi.control107.service.AmbulanciaService;
import jakarta.persistence.EntityNotFoundException;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AmbulanciaServiceImpl extends AbstractService<Ambulancia> implements AmbulanciaService {

    private final AmbulanciaRepository repository;
    private final InsumoRepository insumoRepository;

    private final static String[] REGEX_PATENTE = {"^[A-Z]{3}\\d{3}$","^[A-Z]{2}\\d{3}[A-Z]{2}$"};

    public AmbulanciaServiceImpl(AmbulanciaRepository ambulanciaRepository, InsumoRepository insumoRepository) {
        super(ambulanciaRepository, Ambulancia.class);
        this.repository = ambulanciaRepository;
        this.insumoRepository = insumoRepository;
    }

    @Override
    public List<AmbulanciaDTO> listarTodas() {
        return repository.findAllByEliminadoIsFalse().stream().map(AmbulanciaDTO::new).toList();
    }

    @Override
    public AmbulanciaDTO obtenerPorId(Long id) {
        Ambulancia a = obtener(id);
        return new AmbulanciaDTO(a);
    }

    @Transactional
    @Override
    public AmbulanciaDTO crearAmbulancia(AmbulanciaRequestDTO request) {
        validar(request, null);
        var insumos = obtenerInsumos(request);
        Ambulancia guardada = repository.save(request.toAmbulancia(insumos));
        return new AmbulanciaDTO(guardada);
    }

    @Transactional
    @Override
    public AmbulanciaDTO actualizarAmbulancia(Long id, AmbulanciaRequestDTO request) {
        validar(request, id);
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

    private void validar(AmbulanciaRequestDTO request, Long id) {
        if (request.getPatente() != null) {
            String patente = request.getPatente().trim();
            boolean regexMatch = Arrays.stream(REGEX_PATENTE).anyMatch(patente::matches);
            if (!regexMatch) {
                throw new IllegalArgumentException("Formato de patente inválido");
            }
            boolean existe = (id == null)
                    ? repository.existsByPatenteIgnoreCaseAndEliminadoIsFalse(patente)
                    : repository.existsByPatenteIgnoreCaseAndEliminadoIsFalseAndIdNot(patente, id);
            if (existe) {
                throw new IllegalArgumentException("Ya existe una ambulancia con esa patente");
            }
        }

    }

    private @NonNull Set<Insumo> obtenerInsumos(AmbulanciaRequestDTO request) {
        return request.getInsumos().stream()
                .map(i -> insumoRepository.findByIdAndEliminadoIsFalse(i)
                        .orElseThrow(() -> new EntityNotFoundException("No se encontró el insumo con id " + i)))
                .collect(Collectors.toSet());
    }
}
