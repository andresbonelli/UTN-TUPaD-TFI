package com.tup.tfi.control107.service.impl;


import com.tup.tfi.control107.config.JwtUtil;
import com.tup.tfi.control107.config.PasswordUtil;
import com.tup.tfi.control107.dto.LoginDTO;
import com.tup.tfi.control107.dto.UsuarioDTO;
import com.tup.tfi.control107.dto.request.LoginRequestDTO;
import com.tup.tfi.control107.exception.CredencialesInvalidasException;
import com.tup.tfi.control107.model.entity.Usuario;
import com.tup.tfi.control107.repository.UsuarioRepository;
import com.tup.tfi.control107.service.AuthService;
import com.tup.tfi.control107.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UsuarioService usuarioService;
    private final UsuarioRepository usuarioRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    private static final String TOKEN_TYPE = "Bearer";
    private static final String TOKEN_SCOPE = "message:read";

    @Override
    public LoginDTO login(LoginRequestDTO request) throws CredencialesInvalidasException {
        Optional<Usuario> usuario = usuarioRepository.findByEmailAndEliminadoIsFalse(request.mail());
        if (usuario.isEmpty()) {
            throw new CredencialesInvalidasException();
        }
        verificarClave(request, usuario.get());
        String accessToken = jwtUtil.createToken(new UsuarioDTO(usuario.get()));
        return new LoginDTO(
                accessToken,
                jwtUtil.getExpirationTime(),
                TOKEN_TYPE,
                TOKEN_SCOPE
        );
    }

    private void verificarClave(LoginRequestDTO request, Usuario usuario) throws CredencialesInvalidasException {
        if (!PasswordUtil.verificarClave(
                request.clave().toCharArray(),
                usuario.getClave().getSalt(),
                usuario.getClave().getHash().toCharArray())
        ) {
            throw new CredencialesInvalidasException();
        }
    }
}
