package com.tup.tfi.control107.service;

import com.tup.tfi.control107.dto.ResumenOperativoDTO;
import com.tup.tfi.control107.model.entity.ControlIngreso;

public interface ControlGuardiaService {

    /**
     * Resumen para mostrar en la vista principal.
     */
    ResumenOperativoDTO obtenerResumenOperativo();

    /**
     * Registrar un control de ingreso.
     */
    ControlIngreso registrarControlIngreso(ControlIngreso controlIngreso);
}
