package com.tup.tfi.control107.controller;

import com.tup.tfi.control107.dto.LoginDTO;
import com.tup.tfi.control107.dto.request.LoginRequestDTO;
import com.tup.tfi.control107.exception.CredencialesInvalidasException;
import com.tup.tfi.control107.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService service;

    @PostMapping("/login")
    public ResponseEntity<LoginDTO> login(@RequestBody LoginRequestDTO request) throws CredencialesInvalidasException {
        return ResponseEntity.ok(service.login(request));
    }
}
