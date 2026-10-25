package com.tup.tfi.control107.service.impl;

import com.tup.tfi.control107.dto.InsumoDTO;
import com.tup.tfi.control107.dto.request.InsumoRequestDTO;
import com.tup.tfi.control107.model.entity.CategoriaInsumo;
import com.tup.tfi.control107.model.entity.Insumo;
import com.tup.tfi.control107.repository.CategoriaRepository;
import com.tup.tfi.control107.repository.InsumoRepository;
import com.tup.tfi.control107.service.InsumoService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class InsumoServiceImpl extends AbstractService<Insumo> implements InsumoService {

    private final InsumoRepository repository;
    private final CategoriaRepository categoriaRepository;

    private final static int NOMBRE_MIN_LENGTH = 3;
    private final static int NOMBRE_MAX_LENGTH = 255;

    public InsumoServiceImpl(InsumoRepository repository, CategoriaRepository categoriaRepository) {
        super(repository, Insumo.class);
        this.repository = repository;
        this.categoriaRepository = categoriaRepository;
    }

    @Override
    public List<InsumoDTO> listarTodos() {
        return repository.findAllByEliminadoIsFalse().stream().map(InsumoDTO::new).toList();
    }

    @Override
    public List<InsumoDTO> listarCriticos() {
        return repository.findByCriticoIsTrueAndEliminadoIsFalse().stream().map(InsumoDTO::new).toList();
    }

    @Override
    public List<InsumoDTO> listarPorCategoria(Long categoriaId) {
        return repository.findByCategoriaIdAndEliminadoIsFalse(categoriaId).stream().map(InsumoDTO::new).toList();
    }

    @Override
    public InsumoDTO obtenerPorId(Long id) {
        Insumo i = obtener(id);
        return new InsumoDTO(i);
    }

    @Transactional
    @Override
    public InsumoDTO crearInsumo(InsumoRequestDTO request) {
        validar(request, null);
        var categoria = obtenerCategoria(request.getCategoriaId());
        Insumo guardado = repository.save(request.toInsumo(categoria));
        return new InsumoDTO(guardado);
    }

    @Transactional
    @Override
    public InsumoDTO actualizarInsumo(Long id, InsumoRequestDTO request) {
        validar(request, id);
        Insumo i = obtener(id);
        CategoriaInsumo categoria = request.getCategoriaId() != null ? obtenerCategoria(request.getCategoriaId()) : null;
        request.aplicar(i, categoria);
        repository.save(i);
        return new InsumoDTO(i);
    }

    @Transactional
    @Override
    public void eliminarPorId(Long id) {
        eliminar(id);
    }

    private void validar(InsumoRequestDTO request, Long id) {
        if (request.getNombre() != null) {
            String nombre = request.getNombre().trim();
            if (nombre.length() < NOMBRE_MIN_LENGTH || nombre.length() > NOMBRE_MAX_LENGTH) {
                throw new IllegalArgumentException("El nombre debe tener entre " + NOMBRE_MIN_LENGTH + " y " + NOMBRE_MAX_LENGTH + " caracteres");
            }
            boolean existe = (id == null)
                    ? repository.existsByNombreIgnoreCaseAndEliminadoIsFalse(nombre)
                    : repository.existsByNombreIgnoreCaseAndEliminadoIsFalseAndIdNot(nombre, id);
            if (existe) {
                throw new IllegalArgumentException("Ya existe un insumo con ese nombre");
            }
        }
        if (request.getPuntoControl() != null && request.getPuntoControl() <= 0) {
            throw new IllegalArgumentException("El punto de control debe ser mayor a 0");
        }
    }

    private CategoriaInsumo obtenerCategoria(Long id) {
        return categoriaRepository.findByIdAndEliminadoIsFalse(id).orElseThrow(
                () -> new EntityNotFoundException("No se encontro categoria con id " + id)
        );
    }
}
