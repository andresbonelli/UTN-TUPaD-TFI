package com.tup.tfi.control107.controller;

import com.tup.tfi.control107.dto.CategoriaInsumoDTO;
import com.tup.tfi.control107.dto.request.CategoriaInsumoRequestDTO;
import com.tup.tfi.control107.service.CategoriaInsumoService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/categorias")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMINISTRADOR')")
public class CategoriaInsumoController {

    private final CategoriaInsumoService categoriaService;

    @GetMapping
    public ResponseEntity<List<CategoriaInsumoDTO>> listarTodas() {
        return ResponseEntity.ok(categoriaService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaInsumoDTO> obtenerPorId(@PathVariable Long id) {
        CategoriaInsumoDTO categoria = categoriaService.obtenerPorId(id);
        return ResponseEntity.ok(categoria);
    }

    @PostMapping
    public ResponseEntity<CategoriaInsumoDTO> crear(@RequestBody CategoriaInsumoRequestDTO request) {
        CategoriaInsumoDTO guardada = categoriaService.crearCategoria(request);
        return ResponseEntity.ok(guardada);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoriaInsumoDTO> actualizar(@PathVariable Long id, @RequestBody CategoriaInsumoRequestDTO request) {
        CategoriaInsumoDTO guardada = categoriaService.actualizarCategoria(id, request);
        return ResponseEntity.ok(guardada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        categoriaService.eliminarPorId(id);
        return ResponseEntity.noContent().build();
    }
}
