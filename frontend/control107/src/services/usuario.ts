import { api } from "./api";

import type {
    ActualizarUsuarioRequest,
    Usuario,
    UsuarioRequest,
} from "../interfaces/Usuario";

export async function listarUsuarios(): Promise<Usuario[]> {
    const response =
        await api.get<Usuario[]>("/usuarios");

    return response.data;
}

export async function crearUsuario(
    usuario: UsuarioRequest,
): Promise<Usuario> {
    const response =
        await api.post<Usuario>(
            "/usuarios",
            usuario,
        );

    return response.data;
}

export async function actualizarUsuario(
    id: number,
    usuario: ActualizarUsuarioRequest,
): Promise<Usuario> {
    const response =
        await api.put<Usuario>(
            `/usuarios/${id}`,
            usuario,
        );

    return response.data;
}

export async function eliminarUsuario(
    id: number,
): Promise<void> {
    await api.delete(`/usuarios/${id}`);
}