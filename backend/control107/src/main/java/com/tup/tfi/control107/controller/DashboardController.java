package com.tup.tfi.control107.controller;

import com.tup.tfi.control107.dto.ResumenOperativoDTO;
import com.tup.tfi.control107.service.TurnoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final TurnoService turnoService;

    @GetMapping("/resumen")
    public ResponseEntity<ResumenOperativoDTO> obtenerResumenOperativo() {
        ResumenOperativoDTO resumen = turnoService.obtenerResumenOperativo();
        return ResponseEntity.ok(resumen);
    }
}
