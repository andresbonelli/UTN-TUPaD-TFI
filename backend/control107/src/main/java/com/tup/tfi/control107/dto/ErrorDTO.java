package com.tup.tfi.control107.dto;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

public record ErrorDTO(
        LocalDateTime timestamp,
        int status,
        String error,
        List<String> detalles
) {
    public static ErrorDTO of(int status, String error, List<String> detalles) {
        return new ErrorDTO(LocalDateTime.now(), status, error, detalles);
    }
    public static ErrorDTO simple(int status, String error, String mensaje) {
        return new ErrorDTO(LocalDateTime.now(), status, error, Collections.singletonList(mensaje));
    }
}
