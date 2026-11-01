package com.tup.tfi.control107.dto;

public record LoginDTO(
        String access_token,
        Long expires_in,
        String token_type,
        String scope
) {
}