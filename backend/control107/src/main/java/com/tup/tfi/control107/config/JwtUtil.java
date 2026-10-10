package com.tup.tfi.control107.config;

import com.tup.tfi.control107.dto.UsuarioDTO;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    @Value("${security.jwt.secret-key:zP8u6fW7vB4n9m2K5jH3gD1sA6dQ9wE0rT7yU4iO1pL3kJ5hG8fD2sS4aA0zX9cC}")
    private String secretKey;

    @Getter
    @Value("${security.jwt.expiration-time:3600000}")
    private long expirationTime;

    public String createToken(UsuarioDTO usuario) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("rol", usuario.getRol().name());
        claims.put("mail", usuario.getEmail());

        return Jwts.builder()
                .subject(usuario.getId().toString())
                .claims(claims)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(getSecretKey())
                .compact();
    }

    public Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean isTokenExpired(String token) {
        Claims claims = extractClaims(token);
        Date expiration = claims.getExpiration();
        return expiration.before(new Date(System.currentTimeMillis()));
    }


    private SecretKey getSecretKey() {
        if (null == secretKey || secretKey.isEmpty()) {
            return Jwts.SIG.HS256.key().build();
        } else {
            return Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
        }
    }
}
