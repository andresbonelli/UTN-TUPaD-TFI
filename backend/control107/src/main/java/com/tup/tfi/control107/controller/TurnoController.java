package com.tup.tfi.control107.controller;

import com.tup.tfi.control107.dto.ResumenOperativoDTO;
import com.tup.tfi.control107.dto.TurnoDTO;
import com.tup.tfi.control107.service.TurnoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/v1/turnos")
@RequiredArgsConstructor
public class TurnoController {

    private final TurnoService turnoService;

    @GetMapping
    public ResponseEntity<List<TurnoDTO>> mostrarTurnos() {
        List<TurnoDTO> turnos = turnoService.obtenerTurnos();
        return ResponseEntity.ok(turnos);
    }

    @GetMapping("/resumen")
    public ResponseEntity<ResumenOperativoDTO> obtenerResumenOperativo() {
        ResumenOperativoDTO resumen = turnoService.obtenerResumenOperativo();
        return ResponseEntity.ok(resumen);
    }
}
