package com.tup.tfi.emergencias107.dto;

import lombok.*;

import java.util.List;

@Getter
@Builder
public class ResumenOperativoDTO {
    private long turnosActivos;
    private String ambulanciasDisponibles; // Ej: "05/08"
    private long alertasPendientes;
    private long controlesIncompletos;
    private List<AmbulanciaDTO> listaAmbulancias;
    private List<InconsistenciaTicketDTO> alertasPrioritarias;
}
