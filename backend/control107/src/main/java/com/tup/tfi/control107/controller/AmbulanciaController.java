package com.tup.tfi.control107.controller;

import com.tup.tfi.control107.dto.AmbulanciaDTO;
import com.tup.tfi.control107.dto.request.AmbulanciaRequestDTO;
import com.tup.tfi.control107.service.AmbulanciaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ambulancias")
@RequiredArgsConstructor
public class AmbulanciaController {

    private final AmbulanciaService ambulanciaService;

    @GetMapping
    public ResponseEntity<List<AmbulanciaDTO>> listarTodas() {
        var dtos = ambulanciaService.listarTodas();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AmbulanciaDTO> obtenerPorId(@PathVariable Long id) {
        var ambulancia = ambulanciaService.obtenerPorId(id);
        return ambulancia != null ? ResponseEntity.ok(ambulancia) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<AmbulanciaDTO> guardar(@RequestBody AmbulanciaRequestDTO ambulancia) {
        var guardada = ambulanciaService.guardar(ambulancia);
        return ResponseEntity.ok(guardada);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AmbulanciaDTO> actualizar(@PathVariable Long id, @RequestBody AmbulanciaRequestDTO ambulancia) {
        var guardada = ambulanciaService.actualizar(id, ambulancia);
        return ResponseEntity.ok(guardada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        ambulanciaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
