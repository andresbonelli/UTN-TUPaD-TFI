export type RolUsuario =
  | "ADMINISTRADOR"
  | "ENFERMERO";

export interface Usuario {
  id: number;
  nombre: string;
  dni: string;
  email: string;
  rol: RolUsuario;
  activo: boolean;
}

export interface UsuarioRequest {
    nombre: string;
    dni: string;
    email: string;
    rol: RolUsuario;
    clave: string;
    activo: boolean;
}

export interface ActualizarUsuarioRequest {
    nombre: string;
    dni: string;
    email: string;
    rol: RolUsuario;
    activo: boolean;
}