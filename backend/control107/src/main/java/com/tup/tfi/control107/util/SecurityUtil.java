package com.tup.tfi.control107.util;

import com.tup.tfi.control107.service.TurnoService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component("securityUtil")
@RequiredArgsConstructor
public class SecurityUtil {

    private final TurnoService turnoService;

    public boolean esEnfermeroAsignado(Long idTurno, Authentication authentication) {
        long usuarioId = Long.parseLong(authentication.getName());
        return turnoService.obtenerPorId(idTurno).getEnfermero().getId().equals(usuarioId);
    }
}
