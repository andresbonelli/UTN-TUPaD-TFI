package com.tup.tfi.control107.service;

import com.tup.tfi.control107.dto.ResumenOperativoDTO;
import com.tup.tfi.control107.dto.TurnoDTO;
import com.tup.tfi.control107.dto.request.InsumoRequestDTO;
import com.tup.tfi.control107.dto.request.TurnoRequestDTO;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface TurnoService {

    /**
     * Resumen para mostrar en la vista principal.
     */
    ResumenOperativoDTO obtenerResumenOperativo();

    @Transactional
    TurnoDTO crearTurno(TurnoRequestDTO request);

    /**
     * Registrar un control de ingreso.
     */
    void registrarIngreso(Long turnoId, List<InsumoRequestDTO> insumos);

    void registrarEgreso(Long turnoId, List<InsumoRequestDTO> insumos);

    List<TurnoDTO> obtenerTurnos();
}
