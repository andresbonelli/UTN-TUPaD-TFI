package com.tup.tfi.control107.dto.request;

import com.tup.tfi.control107.model.entity.Ambulancia;
import com.tup.tfi.control107.model.entity.Turno;
import com.tup.tfi.control107.model.entity.Usuario;
import com.tup.tfi.control107.model.enums.EstadoTurno;
import com.tup.tfi.control107.model.enums.HorarioTurno;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TurnoRequestDTO {
    private LocalDate fecha;
    private HorarioTurno horario;
    private Long adminId;
    private Long enfermeroId;
    private Long ambulanciaId;
    private String nombreChofer;
    private String nombreMedico;

    public Turno toTurno(Usuario admin, Usuario enfermero, Ambulancia ambulancia) {
        Turno turno = Turno.builder()
                .fecha(fecha)
                .horario(horario)
                .nombreChofer(nombreChofer)
                .admin(admin)
                .enfermero(enfermero)
                .nombreChofer(nombreChofer)
                .nombreMedico(nombreMedico)
                .estado(EstadoTurno.PROGRAMADO)
                .build();

        turno.setAmbulancia(ambulancia);
        return turno;
    }
}
