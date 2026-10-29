import { api } from "./api";

import type { Ambulancia, AmbulanciaRequest } from "../interfaces/Ambulancia";

export async function listarAmbulancias(): Promise<Ambulancia[]> {
    const response =
        await api.get<Ambulancia[]>("/ambulancias");

    return response.data;
}

export async function crearAmbulancia(
    ambulancia: AmbulanciaRequest
): Promise<Ambulancia> {
    const response =
        await api.post<Ambulancia>(
            "/ambulancias",
            ambulancia
        );

    return response.data;
}

export async function actualizarAmbulancia(
    id: number,
    ambulancia: AmbulanciaRequest
): Promise<Ambulancia> {
    const response =
        await api.put<Ambulancia>(
            `/ambulancias/${id}`,
            ambulancia
        );

    return response.data;
}