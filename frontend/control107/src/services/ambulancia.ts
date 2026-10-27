import { api } from "./api";

import type { Ambulancia } from "../interfaces/Ambulancia";

export async function listarAmbulancias(): Promise<Ambulancia[]> {
    const response =
        await api.get<Ambulancia[]>("/ambulancias");

    return response.data;
}