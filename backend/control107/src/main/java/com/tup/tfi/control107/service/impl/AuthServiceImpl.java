package com.tup.tfi.control107.service.impl;


import com.tup.tfi.control107.util.JwtUtil;
import com.tup.tfi.control107.util.PasswordUtil;
import com.tup.tfi.control107.dto.LoginDTO;
import com.tup.tfi.control107.dto.UsuarioDTO;
import com.tup.tfi.control107.dto.request.LoginRequestDTO;
import com.tup.tfi.control107.exception.CredencialesInvalidasException;
import com.tup.tfi.control107.model.entity.Usuario;
import com.tup.tfi.control107.repository.UsuarioRepository;
import com.tup.tfi.control107.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UsuarioRepository usuarioRepository;
    private final JwtUtil jwtUtil;

    private static final String TOKEN_TYPE = "Bearer";
    private static final String TOKEN_SCOPE = "message:read";

    @Override
    public LoginDTO login(LoginRequestDTO request) throws CredencialesInvalidasException {
        Usuario usuario = usuarioRepository
                .findByEmailAndEliminadoIsFalse(request.mail().toLowerCase().trim())
                .orElseThrow(CredencialesInvalidasException::new);
        verificarClave(request, usuario);
        String accessToken = jwtUtil.createToken(new UsuarioDTO(usuario));
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
