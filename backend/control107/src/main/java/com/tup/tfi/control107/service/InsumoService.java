package com.tup.tfi.control107.service;

import com.tup.tfi.control107.dto.InsumoDTO;
import com.tup.tfi.control107.dto.request.InsumoRequestDTO;

import java.util.List;

public interface InsumoService {
    List<InsumoDTO> listarTodos();

    List<InsumoDTO> listarCriticos();

    InsumoDTO obtenerPorId(Long id);

    InsumoDTO crearInsumo(InsumoRequestDTO request);

    InsumoDTO actualizarInsumo(Long id, InsumoRequestDTO request);

    void eliminarPorId(Long id);
}
