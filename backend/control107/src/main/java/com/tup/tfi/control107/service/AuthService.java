package com.tup.tfi.control107.service;

import com.tup.tfi.control107.dto.LoginDTO;
import com.tup.tfi.control107.dto.request.LoginRequestDTO;
import com.tup.tfi.control107.exception.CredencialesInvalidasException;

public interface AuthService {
    LoginDTO login(LoginRequestDTO request) throws CredencialesInvalidasException;
}
