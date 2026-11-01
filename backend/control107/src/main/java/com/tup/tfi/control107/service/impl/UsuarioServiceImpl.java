package com.tup.tfi.control107.service.impl;

import com.tup.tfi.control107.model.enums.EstadoTurno;
import com.tup.tfi.control107.repository.TurnoRepository;
import com.tup.tfi.control107.util.PasswordUtil;
import com.tup.tfi.control107.dto.UsuarioDTO;
import com.tup.tfi.control107.dto.request.UsuarioRequestDTO;
import com.tup.tfi.control107.model.entity.Usuario;
import com.tup.tfi.control107.repository.UsuarioRepository;
import com.tup.tfi.control107.service.UsuarioService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UsuarioServiceImpl extends AbstractService<Usuario> implements UsuarioService {

    private final UsuarioRepository repository;
    private final TurnoRepository turnoRepository;

    private final static String REGEX_DNI = "^[0-9]{8}$";

    public UsuarioServiceImpl(UsuarioRepository repository, TurnoRepository turnoRepository) {
        super(repository, Usuario.class);
        this.repository = repository;
        this.turnoRepository = turnoRepository;
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

    @Transactional
    @Override
    public UsuarioDTO crearUsuario(UsuarioRequestDTO request) {
        validar(request, null);
        var clave = PasswordUtil.hash(request.getClave().toCharArray(), null);
        Usuario guardado = repository.save(request.toUsuario(clave));
        return new UsuarioDTO(guardado);
    }

    @Transactional
    @Override
    public UsuarioDTO actualizarUsuario(Long id, UsuarioRequestDTO request) {
        validar(request, id);
        Usuario u = obtener(id);
        request.aplicar(u);
        repository.save(u);
        return new UsuarioDTO(u);
    }

    @Transactional
    @Override
    public void eliminarPorId(Long id) {
        if (turnoRepository.existsByEnfermeroIdAndEstadoInAndEliminadoIsFalse(
                id, List.of(EstadoTurno.PROGRAMADO, EstadoTurno.EN_CURSO)
        )) {
            throw new IllegalArgumentException("No se puede eliminar enfermero con turnos activos");
        }
        eliminar(id);
    }

    private void validar(UsuarioRequestDTO request, Long id) {
        if (request.getDni() != null) {
            String dni = request.getDni().trim();
            if (!StringUtils.leftPad(dni,8, "0").matches(REGEX_DNI)) {
                throw new IllegalArgumentException("Formato de DNI inválido");
            }
            boolean existeDni = (id == null)
                    ? repository.existsByDniAndEliminadoIsFalse(dni)
                    : repository.existsByDniAndEliminadoIsFalseAndIdNot(dni, id);
            if (existeDni) {
                throw new IllegalArgumentException("Ya existe un usuario con ese DNI");
            }
        }
        if (request.getEmail() != null) {
            String email = request.getEmail().trim();
            boolean existeEmail = (id == null)
                    ? repository.existsByEmailIgnoreCaseAndEliminadoIsFalse(email)
                    : repository.existsByEmailIgnoreCaseAndEliminadoIsFalseAndIdNot(email, id);
            if (existeEmail) {
                throw new IllegalArgumentException("Ya existe un usuario con ese email");
            }
        }
    }
}
