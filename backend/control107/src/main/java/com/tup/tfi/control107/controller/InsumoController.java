package com.tup.tfi.control107.controller;

import com.tup.tfi.control107.dto.InsumoDTO;
import com.tup.tfi.control107.dto.request.InsumoRequestDTO;
import com.tup.tfi.control107.service.InsumoService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/insumos")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMINISTRADOR')")
public class InsumoController {

    private final InsumoService insumoService;

    @GetMapping
    public ResponseEntity<List<InsumoDTO>> listarTodos() {
        return ResponseEntity.ok(insumoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InsumoDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(insumoService.obtenerPorId(id));
    }

    @GetMapping("/criticos")
    public ResponseEntity<List<InsumoDTO>> listarCriticos() {
        return ResponseEntity.ok(insumoService.listarCriticos());
    }

    @GetMapping("/categoria/{categoriaId}")
    public ResponseEntity<List<InsumoDTO>> listarPorCategoria(@PathVariable Long categoriaId) {
        return ResponseEntity.ok(insumoService.listarPorCategoria(categoriaId));
    }

    @PostMapping
    public ResponseEntity<InsumoDTO> crear(@RequestBody InsumoRequestDTO request) {
        return ResponseEntity.ok(insumoService.crearInsumo(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<InsumoDTO> actualizar(@PathVariable Long id, @RequestBody InsumoRequestDTO request) {
        return ResponseEntity.ok(insumoService.actualizarInsumo(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        insumoService.eliminarPorId(id);
        return ResponseEntity.noContent().build();
    }
}
