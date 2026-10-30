package com.tup.tfi.control107.service.impl;

import com.tup.tfi.control107.dto.CategoriaInsumoDTO;
import com.tup.tfi.control107.dto.request.CategoriaInsumoRequestDTO;
import com.tup.tfi.control107.model.entity.CategoriaInsumo;
import com.tup.tfi.control107.repository.CategoriaRepository;
import com.tup.tfi.control107.repository.InsumoRepository;
import com.tup.tfi.control107.service.CategoriaInsumoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoriaInsumoServiceImpl extends AbstractService<CategoriaInsumo> implements CategoriaInsumoService {

    private final CategoriaRepository repository;
    private final InsumoRepository insumoRepository;

    private final static String REGEX_COLOR = "^#(?:[0-9a-fA-F]{3}){1,2}$";
    private final static int NOMBRE_MIN_LENGTH = 3;
    private final static int NOMBRE_MAX_LENGTH = 100;

    public CategoriaInsumoServiceImpl(CategoriaRepository repository, InsumoRepository insumoRepository) {
        super(repository, CategoriaInsumo.class);
        this.repository = repository;
        this.insumoRepository = insumoRepository;
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
        validar(request, null);
        CategoriaInsumo guardado = repository.save(request.toCategoriaInsumo());
        return new CategoriaInsumoDTO(guardado);
    }

    @Transactional
    @Override
    public CategoriaInsumoDTO actualizarCategoria(Long id, CategoriaInsumoRequestDTO request) {
        validar(request, id);
        CategoriaInsumo c = obtener(id);
        request.aplicar(c);
        repository.save(c);
        return new CategoriaInsumoDTO(c);
    }

    @Transactional
    @Override
    public void eliminarPorId(Long id) {
        if (insumoRepository.existsByCategoriaIdAndEliminadoIsFalse(id)) {
            throw new IllegalArgumentException("No se puede eliminar categoría con insumos activos");
        }
        eliminar(id);
    }

    private void validar(CategoriaInsumoRequestDTO request, Long id) {
        if (request.getNombre() != null) {
            String nombre = request.getNombre().trim();
            if (nombre.length() < NOMBRE_MIN_LENGTH || nombre.length() > NOMBRE_MAX_LENGTH) {
                throw new IllegalArgumentException("El nombre debe tener entre " + NOMBRE_MIN_LENGTH + " y " + NOMBRE_MAX_LENGTH + " caracteres");
            }
            boolean existe = (id == null)
                    ? repository.existsByNombreIgnoreCaseAndEliminadoIsFalse(nombre)
                    : repository.existsByNombreIgnoreCaseAndEliminadoIsFalseAndIdNot(nombre, id);
            if (existe) {
                throw new IllegalArgumentException("Ya existe una categoría con ese nombre");
            }
        }
        if (request.getColor() != null) {
            String color = request.getColor().trim();
            if (!color.matches(REGEX_COLOR)) {
                throw new IllegalArgumentException("Formato de color no válido. Ejemplo: #FF0000");
            }
        }
    }
}
