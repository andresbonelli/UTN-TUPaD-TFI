package com.tup.tfi.control107.controller;

import com.tup.tfi.control107.dto.InsumoDTO;
import com.tup.tfi.control107.repository.InsumoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/insumos")
@RequiredArgsConstructor
public class InsumoController {

    private final InsumoRepository insumoRepository;

    @GetMapping
    public ResponseEntity<List<InsumoDTO>> listarTodos() {
        return ResponseEntity.ok(insumoRepository.findAll().stream().map(InsumoDTO::new).collect(Collectors.toList()));
    }

    @GetMapping("/categoria/{categoriaId}")
    public ResponseEntity<List<InsumoDTO>> listarPorCategoria(@PathVariable Long categoriaId) {
        return ResponseEntity.ok(insumoRepository.findByCategoriaId(categoriaId).stream().map(InsumoDTO::new).collect(Collectors.toList()));
    }
}
