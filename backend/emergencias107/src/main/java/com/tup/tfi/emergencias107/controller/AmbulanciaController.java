package com.tup.tfi.emergencias107.controller;

import com.tup.tfi.emergencias107.dto.AmbulanciaDTO;
import com.tup.tfi.emergencias107.model.Ambulancia;
import com.tup.tfi.emergencias107.repository.AmbulanciaRepository;
import com.tup.tfi.emergencias107.service.ControlGuardiaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ambulancias")
@RequiredArgsConstructor
public class AmbulanciaController {

    private final AmbulanciaRepository ambulanciaRepository;
    private final ControlGuardiaService controlGuardiaService;

    @GetMapping
    public ResponseEntity<List<AmbulanciaDTO>> listarTodas() {
        List<AmbulanciaDTO> dtos = ambulanciaRepository.findAll().stream()
                .map(AmbulanciaDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AmbulanciaDTO> obtenerPorId(@PathVariable Long id) {
        return ambulanciaRepository.findById(id)
                .map(AmbulanciaDTO::new)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<AmbulanciaDTO> guardar(@RequestBody Ambulancia ambulancia) {
        Ambulancia guardada = ambulanciaRepository.save(ambulancia);
        return ResponseEntity.ok(new AmbulanciaDTO(guardada));
    }
}
