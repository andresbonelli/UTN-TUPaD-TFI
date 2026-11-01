package com.tup.tfi.control107.service;

import com.tup.tfi.control107.dto.AmbulanciaDTO;
import com.tup.tfi.control107.dto.request.AmbulanciaRequestDTO;

import java.util.List;

public interface AmbulanciaService {
    List<AmbulanciaDTO> listarTodas();

    AmbulanciaDTO obtenerPorId(Long id);

    AmbulanciaDTO crearAmbulancia(AmbulanciaRequestDTO request);

    AmbulanciaDTO actualizarAmbulancia(Long id, AmbulanciaRequestDTO request);

    void eliminarPorId(Long id);
}
