package com.tup.tfi.control107.dto;

import com.tup.tfi.control107.model.enums.HorarioTurno;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Builder
public class EstadisticasTurnosDTO {
    private List<ResumenTurnoDTO> turnosActivos;
    private List<ResumenTurnoDTO> turnosConFaltantes;
    private List<ResumenTurnoDTO> turnosCancelados;

    @Getter
    @AllArgsConstructor
    public static class ResumenTurnoDTO {
        private Long id;
        private LocalDate fecha;
        private HorarioTurno horario;
    }
}
