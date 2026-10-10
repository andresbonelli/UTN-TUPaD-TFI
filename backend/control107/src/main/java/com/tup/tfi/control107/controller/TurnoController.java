package com.tup.tfi.control107.controller;

import com.tup.tfi.control107.dto.ResumenOperativoDTO;
import com.tup.tfi.control107.dto.TurnoDTO;
import com.tup.tfi.control107.dto.request.IngresoEgresoDTO;
import com.tup.tfi.control107.dto.request.TurnoRequestDTO;
import com.tup.tfi.control107.service.TurnoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/turnos")
@RequiredArgsConstructor
public class TurnoController {

    private final TurnoService turnoService;

    @GetMapping
    public ResponseEntity<List<TurnoDTO>> mostrarTurnos() {
        List<TurnoDTO> turnos = turnoService.obtenerTodos();
        return ResponseEntity.ok(turnos);
    }

    @GetMapping("/activos")
    public ResponseEntity<List<TurnoDTO>> obtenerTurnosActivos() {
        return ResponseEntity.ok(turnoService.obtenerTurnosActivos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TurnoDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(turnoService.obtenerPorId(id));
    }

    @GetMapping("/resumen")
    public ResponseEntity<ResumenOperativoDTO> obtenerResumenOperativo() {
        ResumenOperativoDTO resumen = turnoService.obtenerResumenOperativo();
        return ResponseEntity.ok(resumen);
    }

    @PostMapping
    public ResponseEntity<TurnoDTO> crearTurno(@RequestBody TurnoRequestDTO request) {
        TurnoDTO turno = turnoService.crearTurno(request);
        return ResponseEntity.ok(turno);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TurnoDTO> modificarTurno(@PathVariable Long id, @RequestBody TurnoRequestDTO request) {
        TurnoDTO turno = turnoService.modificarTurno(id, request);
        return ResponseEntity.ok(turno);
    }

    @PostMapping("/ingreso")
    public ResponseEntity<Void> registrarIngreso(@RequestBody IngresoEgresoDTO request) {
        turnoService.registrarIngreso(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/egreso")
    public ResponseEntity<Void> registrarEgreso(@RequestBody IngresoEgresoDTO request) {
        turnoService.registrarEgreso(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/cancelar")
    public ResponseEntity<TurnoDTO> cancelarTurno(
            @PathVariable Long id,
            @RequestParam(required = false) String observaciones) {
        TurnoDTO turno = turnoService.cancelarTurno(id, observaciones);
        return ResponseEntity.ok(turno);
    }
}
