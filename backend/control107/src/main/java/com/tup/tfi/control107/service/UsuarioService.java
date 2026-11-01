package com.tup.tfi.control107.service;

import com.tup.tfi.control107.dto.UsuarioDTO;
import com.tup.tfi.control107.dto.request.UsuarioRequestDTO;

import java.util.List;

public interface UsuarioService {
    List<UsuarioDTO> listarTodos();

    UsuarioDTO obtenerPorId(Long id);

    UsuarioDTO crearUsuario(UsuarioRequestDTO request);

    UsuarioDTO actualizarUsuario(Long id, UsuarioRequestDTO request);

    void eliminarPorId(Long id);
}
