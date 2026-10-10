package com.tup.tfi.control107.service.impl;

import com.tup.tfi.control107.dto.CategoriaInsumoDTO;
import com.tup.tfi.control107.dto.request.CategoriaInsumoRequestDTO;
import com.tup.tfi.control107.model.entity.CategoriaInsumo;
import com.tup.tfi.control107.repository.CategoriaRepository;
import com.tup.tfi.control107.service.CategoriaInsumoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoriaInsumoServiceImpl extends AbstractService<CategoriaInsumo> implements CategoriaInsumoService {

    private final CategoriaRepository repository;

    public CategoriaInsumoServiceImpl(CategoriaRepository repository) {
        super(repository, CategoriaInsumo.class);
        this.repository = repository;
    }

    @Override
    public List<CategoriaInsumoDTO> listarTodas() {
        return repository.findAllByEliminadoIsFalse().stream().map(CategoriaInsumoDTO::new).toList();
    }

    @Override
    public CategoriaInsumoDTO obtenerPorId(Long id) {
        CategoriaInsumo c = obtener(id);
        return new CategoriaInsumoDTO(c);
    }

    @Transactional
    @Override
    public CategoriaInsumoDTO crearCategoria(CategoriaInsumoRequestDTO request) {
        CategoriaInsumo guardado = repository.save(request.toCategoriaInsumo());
        return new CategoriaInsumoDTO(guardado);
    }

    @Transactional
    @Override
    public CategoriaInsumoDTO actualizarCategoria(Long id, CategoriaInsumoRequestDTO request) {
        CategoriaInsumo c = obtener(id);
        request.aplicar(c);
        repository.save(c);
        return new CategoriaInsumoDTO(c);
    }

    @Transactional
    @Override
    public void eliminarPorId(Long id) {
        eliminar(id);
    }
}
