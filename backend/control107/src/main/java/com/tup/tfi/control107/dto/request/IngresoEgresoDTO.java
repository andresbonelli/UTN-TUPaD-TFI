package com.tup.tfi.control107.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class IngresoEgresoDTO {
    private Long turnoId;
    private List<ControlInsumoRequestDTO> insumos;
    private String observaciones;
}
