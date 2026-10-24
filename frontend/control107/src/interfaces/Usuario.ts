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