package com.tup.tfi.control107.service.impl;

import com.tup.tfi.control107.dto.AmbulanciaDTO;
import com.tup.tfi.control107.dto.request.AmbulanciaRequestDTO;
import com.tup.tfi.control107.model.entity.Ambulancia;
import com.tup.tfi.control107.model.entity.InsumoAmbulancia;
import com.tup.tfi.control107.repository.AmbulanciaRepository;
import com.tup.tfi.control107.repository.InsumoAmbulanciaRepository;
import com.tup.tfi.control107.service.AmbulanciaService;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AmbulanciaServiceImpl implements AmbulanciaService {

    private final AmbulanciaRepository ambulanciaRepository;
    private final InsumoAmbulanciaRepository insumoRepository;

    @Override
    public List<AmbulanciaDTO> listarTodas() {
        return ambulanciaRepository.findAll().stream()
                .map(AmbulanciaDTO::new)
                .collect(Collectors.toList());
    }

    @Override
    public AmbulanciaDTO obtenerPorId(Long id) {
        return ambulanciaRepository.findById(id)
                .map(AmbulanciaDTO::new)
                .orElse(null);
    }

    @Override
    public AmbulanciaDTO guardar(AmbulanciaRequestDTO request) {
        var ambulancia = Ambulancia.builder()
                .patente(request.getPatente())
                .disponible(request.isDisponible())
                .insumos(obtenerInsumos(request))
                .build();
        var guardada = ambulanciaRepository.save(ambulancia);
        return new AmbulanciaDTO(guardada);
    }

    @Override
    public AmbulanciaDTO actualizar(Long id, AmbulanciaRequestDTO request) {
        var ambulancia = ambulanciaRepository.findById(id).orElse(null);
        if (ambulancia != null) {
            ambulancia.setPatente(request.getPatente());
            ambulancia.setDisponible(request.isDisponible());
            ambulancia.setInsumos(obtenerInsumos(request)
            );
            var actualizada = ambulanciaRepository.save(ambulancia);
            return new AmbulanciaDTO(actualizada);
        }
        return null;
    }

    @Override
    public void eliminar(Long id) {
        var ambulancia = ambulanciaRepository.findById(id).orElse(null);
        if (ambulancia != null) {
            ambulancia.borradoLogico();
            ambulanciaRepository.save(ambulancia);
        }
    }

    private @NonNull Set<InsumoAmbulancia> obtenerInsumos(AmbulanciaRequestDTO request) {
        return request.getInsumos().stream()
                .map(i -> InsumoAmbulancia.builder()
                        .insumo(insumoRepository.findById(i.getIdInsumo())
                                .map(InsumoAmbulancia::getInsumo)
                                .orElse(null))
                        .stock(i.getCantidad())
                        .build())
                .collect(Collectors.toSet());
    }
}
