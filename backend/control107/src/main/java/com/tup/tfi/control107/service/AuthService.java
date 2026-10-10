package com.tup.tfi.control107.service;

import com.tup.tfi.control107.dto.LoginDTO;
import com.tup.tfi.control107.dto.request.LoginRequestDTO;

public interface AuthService {
    LoginDTO login(LoginRequestDTO request) throws Exception;
}
