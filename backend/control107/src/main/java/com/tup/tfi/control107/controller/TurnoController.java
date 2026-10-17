package com.tup.tfi.control107.controller;

import com.tup.tfi.control107.dto.ResumenOperativoDTO;
import com.tup.tfi.control107.dto.TurnoDTO;
import com.tup.tfi.control107.dto.request.CancelarTurnoDTO;
import com.tup.tfi.control107.dto.request.IngresoEgresoDTO;
import com.tup.tfi.control107.dto.request.TurnoRequestDTO;
import com.tup.tfi.control107.model.entity.Usuario;
import com.tup.tfi.control107.service.TurnoService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/v1/turnos")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
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

    @GetMapping("/enfermero/{enfermeroId}")
    public ResponseEntity<List<TurnoDTO>> obtenerTurnosPorEnfermero(@PathVariable Long enfermeroId) {
        return ResponseEntity.ok(turnoService.obtenerPorEnfermeroId(enfermeroId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TurnoDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(turnoService.obtenerPorId(id));
    }

    @GetMapping("/resumen")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<ResumenOperativoDTO> obtenerResumenOperativo() {
        ResumenOperativoDTO resumen = turnoService.obtenerResumenOperativo();
        return ResponseEntity.ok(resumen);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<TurnoDTO> crearTurno(@RequestBody TurnoRequestDTO request, Authentication authentication) {
        long adminId = Long.parseLong((String) Objects.requireNonNull(authentication.getPrincipal()));
        TurnoDTO turno = turnoService.crearTurno(adminId, request);
        return ResponseEntity.ok(turno);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<TurnoDTO> modificarTurno(@PathVariable Long id, @RequestBody TurnoRequestDTO request) {
        TurnoDTO turno = turnoService.modificarTurno(id, request);
        return ResponseEntity.ok(turno);
    }

    @PostMapping("/ingreso")
    @PreAuthorize("@securityUtil.esEnfermeroAsignado(#id, authentication)")
    public ResponseEntity<Void> registrarIngreso(@RequestBody IngresoEgresoDTO request) {
        turnoService.registrarIngreso(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/egreso")
    @PreAuthorize("@securityUtil.esEnfermeroAsignado(#id, authentication)")
    public ResponseEntity<Void> registrarEgreso(@RequestBody IngresoEgresoDTO request) {
        turnoService.registrarEgreso(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/cancelar")
    @PreAuthorize("hasRole('ADMINISTRADOR') or @securityUtil.esEnfermeroAsignado(#id, authentication)")
    public ResponseEntity<TurnoDTO> cancelarTurno(
            @PathVariable Long id,
            @RequestBody CancelarTurnoDTO request) {
        TurnoDTO turno = turnoService.cancelarTurno(id, request.getObservaciones());
        return ResponseEntity.ok(turno);
    }
}
