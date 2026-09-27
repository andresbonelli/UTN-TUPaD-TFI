package com.tup.tfi.control107.service;

import com.tup.tfi.control107.dto.ResumenOperativoDTO;
import com.tup.tfi.control107.dto.TurnoDTO;
import com.tup.tfi.control107.dto.request.IngresoEgresoDTO;
import com.tup.tfi.control107.dto.request.InsumoRequestDTO;
import com.tup.tfi.control107.dto.request.TurnoRequestDTO;

import java.util.List;

public interface TurnoService {

    /**
     * Resumen para mostrar en la vista principal.
     */
    ResumenOperativoDTO obtenerResumenOperativo();

    TurnoDTO crearTurno(TurnoRequestDTO request);

    void registrarIngreso(IngresoEgresoDTO request);

    void registrarEgreso(IngresoEgresoDTO request);

    List<TurnoDTO> obtenerTodos();

    List<TurnoDTO> obtenerTurnosActivos();

    TurnoDTO cancelarTurno(Long turnoId);

    TurnoDTO modificarTurno(Long turnoId, TurnoRequestDTO request);
}
