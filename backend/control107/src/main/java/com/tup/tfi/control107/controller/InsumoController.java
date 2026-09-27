package com.tup.tfi.control107.controller;

import com.tup.tfi.control107.dto.InsumoDTO;
import com.tup.tfi.control107.service.InsumoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/insumos")
@RequiredArgsConstructor
public class InsumoController {

    private final InsumoService insumoService;

    @GetMapping
    public ResponseEntity<List<InsumoDTO>> listarTodos() {
        return ResponseEntity.ok(insumoService.listarTodos());
    }

    @GetMapping("/categoria/{categoriaId}")
    public ResponseEntity<List<InsumoDTO>> listarPorCategoria(@PathVariable Long categoriaId) {
        return ResponseEntity.ok(insumoService.listarPorCategoria(categoriaId));
    }
}
