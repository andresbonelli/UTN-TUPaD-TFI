package com.tup.tfi.control107.service.impl;

import com.tup.tfi.control107.config.PasswordUtil;
import com.tup.tfi.control107.dto.UsuarioDTO;
import com.tup.tfi.control107.dto.request.UsuarioRequestDTO;
import com.tup.tfi.control107.model.entity.Usuario;
import com.tup.tfi.control107.repository.UsuarioRepository;
import com.tup.tfi.control107.service.UsuarioService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioServiceImpl extends AbstractService<Usuario> implements UsuarioService {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioServiceImpl(UsuarioRepository repository, PasswordEncoder passwordEncoder) {
        super(repository, Usuario.class);
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<UsuarioDTO> listarTodos() {
        return repository.findAllByEliminadoIsFalse().stream().map(UsuarioDTO::new).toList();
    }

    @Override
    public UsuarioDTO obtenerPorId(Long id) {
        Usuario u = obtener(id);
        return new UsuarioDTO(u);
    }

    @Override
    public UsuarioDTO crearUsuario(UsuarioRequestDTO request) {
        var clave = PasswordUtil.hash(request.getClave().toCharArray(), null);
        Usuario guardado = repository.save(request.toUsuario(clave));
        return new UsuarioDTO(guardado);
    }

    @Override
    public UsuarioDTO actualizarUsuario(Long id, UsuarioRequestDTO request) {
        Usuario u = obtener(id);
        request.aplicar(u);
        repository.save(u);
        return new UsuarioDTO(u);
    }

    @Override
    public void eliminarPorId(Long id) {
        eliminar(id);
    }
}
