package com.tup.tfi.control107.util;

import com.tup.tfi.control107.service.TurnoService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component("securityUtil")
@RequiredArgsConstructor
public class SecurityUtil {

    private final TurnoService turnoService;

    boolean esEnfermeroAsignado(Long idTurno, Authentication authentication) {
        long usuarioId = Long.parseLong((String) Objects.requireNonNull(authentication.getPrincipal()));
        return turnoService.obtenerPorId(idTurno).getEnfermero().getId().equals(usuarioId);
    }
}
