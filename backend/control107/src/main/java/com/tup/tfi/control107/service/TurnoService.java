package com.tup.tfi.control107.service;

import com.tup.tfi.control107.dto.ResumenOperativoDTO;
import com.tup.tfi.control107.dto.TurnoDTO;
import com.tup.tfi.control107.model.entity.RegistroIngreso;
import com.tup.tfi.control107.model.entity.Turno;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface TurnoService {

    /**
     * Resumen para mostrar en la vista principal.
     */
    ResumenOperativoDTO obtenerResumenOperativo();

    /**
     * Registrar un control de ingreso.
     */
    RegistroIngreso registrarIngreso(RegistroIngreso registroIngreso);

    @Transactional
    void registrarEgreso(Turno turno);

    List<TurnoDTO> obtenerTurnos();
}
