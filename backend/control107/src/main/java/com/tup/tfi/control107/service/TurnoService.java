package com.tup.tfi.control107.service;

import com.tup.tfi.control107.dto.ResumenOperativoDTO;
import com.tup.tfi.control107.dto.TurnoDTO;
import com.tup.tfi.control107.dto.request.IngresoEgresoDTO;
import com.tup.tfi.control107.dto.request.TurnoRequestDTO;

import java.util.List;

public interface TurnoService {

    /**
     * Resumen para mostrar en la vista principal.
     */
    ResumenOperativoDTO obtenerResumenOperativo();

    TurnoDTO crearTurno(Long adminId, TurnoRequestDTO request);

    void registrarIngreso(IngresoEgresoDTO request);

    void registrarEgreso(IngresoEgresoDTO request);

    List<TurnoDTO> obtenerTodos();

    TurnoDTO obtenerPorId(Long id);

    List<TurnoDTO> obtenerTurnosActivos();

    TurnoDTO cancelarTurno(Long turnoId, String observaciones);

    TurnoDTO modificarTurno(Long turnoId, TurnoRequestDTO request);
}
