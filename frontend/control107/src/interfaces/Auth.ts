import type { RolUsuario } from "./Usuario";

export interface LoginRequest {
    mail: string;
    clave: string;
}

export interface LoginResponse {
    access_token: string;
    expires_in: number;
    token_type: string;
    scope: string;
}

export interface JwtPayload {
    sub: string;
    mail: string;
    rol: RolUsuario;
    iat: number;
    exp: number;
}

export interface UsuarioAutenticado {
    id: number;
    email: string;
    rol: RolUsuario;
}