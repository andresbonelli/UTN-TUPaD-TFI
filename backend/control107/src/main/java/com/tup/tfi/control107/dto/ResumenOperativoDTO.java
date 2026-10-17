package com.tup.tfi.control107.dto;

import lombok.*;

import java.util.List;

@Getter
@Builder
public class ResumenOperativoDTO {
    private long turnosActivos;
    private long ambulanciasDisponibles;
    private long ambulanciasTotales;
    private long alertas;
    private List<TurnoDTO> turnosConInconsistencias;
    private List<AmbulanciaDTO> listaAmbulancias;

}
