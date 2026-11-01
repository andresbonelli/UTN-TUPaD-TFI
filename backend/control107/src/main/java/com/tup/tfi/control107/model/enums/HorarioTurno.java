package com.tup.tfi.control107.model.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum HorarioTurno {
    MANIANA("06:00","14:00"),
    TARDE("14:00","22:00"),
    NOCHE("22:00","06:00");

    private final String horaDesde;
    private final String horaHasta;
}
