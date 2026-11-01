package com.tup.tfi.control107.service;

import com.tup.tfi.control107.dto.CategoriaInsumoDTO;
import com.tup.tfi.control107.dto.request.CategoriaInsumoRequestDTO;

import java.util.List;

public interface CategoriaInsumoService {
    List<CategoriaInsumoDTO> listarTodas();

    CategoriaInsumoDTO obtenerPorId(Long id);

    CategoriaInsumoDTO crearCategoria(CategoriaInsumoRequestDTO request);

    CategoriaInsumoDTO actualizarCategoria(Long id, CategoriaInsumoRequestDTO request);

    void eliminarPorId(Long id);
}
