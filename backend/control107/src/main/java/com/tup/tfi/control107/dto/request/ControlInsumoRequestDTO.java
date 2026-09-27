package com.tup.tfi.control107.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ControlInsumoRequestDTO {
    private Long id;
    private int cantidad;
}
