package com.tup.tfi.emergencias107.controller;

import com.tup.tfi.emergencias107.dto.ResumenOperativoDTO;
import com.tup.tfi.emergencias107.service.ControlGuardiaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final ControlGuardiaService controlGuardiaService;

    @GetMapping("/resumen")
    public ResponseEntity<ResumenOperativoDTO> obtenerResumenOperativo() {
        ResumenOperativoDTO resumen = controlGuardiaService.obtenerResumenOperativo();
        return ResponseEntity.ok(resumen);
    }
}
