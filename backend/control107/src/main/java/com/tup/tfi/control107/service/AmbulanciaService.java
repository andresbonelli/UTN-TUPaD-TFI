package com.tup.tfi.control107.service;

import com.tup.tfi.control107.dto.AmbulanciaDTO;
import com.tup.tfi.control107.dto.request.AmbulanciaRequestDTO;

import java.util.List;

public interface AmbulanciaService {
    List<AmbulanciaDTO> listarTodas();
    AmbulanciaDTO obtenerPorId(Long id);
    AmbulanciaDTO guardar(AmbulanciaRequestDTO request);
    AmbulanciaDTO actualizar(Long id, AmbulanciaRequestDTO request);
    void eliminar(Long id);
}
