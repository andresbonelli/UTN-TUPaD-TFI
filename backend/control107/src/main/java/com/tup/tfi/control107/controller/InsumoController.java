package com.tup.tfi.control107.controller;

import com.tup.tfi.control107.model.entity.Insumo;
import com.tup.tfi.control107.repository.InsumoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/insumos")
@RequiredArgsConstructor
public class InsumoController {

    private final InsumoRepository insumoRepository;

    @GetMapping
    public ResponseEntity<List<Insumo>> listarTodos() {
        return ResponseEntity.ok(insumoRepository.findAll());
    }

    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<List<Insumo>> listarPorCategoria(@PathVariable String categoria) {
        return ResponseEntity.ok(insumoRepository.findByCategoria(categoria));
    }
}
