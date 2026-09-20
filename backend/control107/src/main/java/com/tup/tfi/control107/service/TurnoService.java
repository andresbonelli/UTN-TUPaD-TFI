package com.tup.tfi.control107.service;

import com.tup.tfi.control107.dto.ResumenOperativoDTO;
import com.tup.tfi.control107.dto.TurnoDTO;
import com.tup.tfi.control107.model.entity.Turno;

import java.util.List;

public interface TurnoService {

    /**
     * Resumen para mostrar en la vista principal.
     */
    ResumenOperativoDTO obtenerResumenOperativo();

    /**
     * Registrar un control de ingreso.
     */
    void registrarIngreso(Turno turno);

    void registrarEgreso(Turno turno);

    List<TurnoDTO> obtenerTurnos();
}
