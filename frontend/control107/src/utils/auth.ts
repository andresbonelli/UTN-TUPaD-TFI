import type { RolUsuario } from "../interfaces/Usuario";

export function obtenerRutaInicial(
    rol: RolUsuario
): string {
    if (rol === "ENFERMERO") {
        return "/operativo";
    }

    if (rol === "ADMINISTRADOR") {
        return "/admin";
    }

    return "/login";
}