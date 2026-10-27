import { api } from "./api";

import type { Usuario } from "../interfaces/Usuario";

export async function listarUsuarios(): Promise<Usuario[]> {
    const response =
        await api.get<Usuario[]>("/usuarios");

    return response.data;
}