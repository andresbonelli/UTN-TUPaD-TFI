import { api } from "./api";

import type { Insumo } from "../interfaces/Insumo";

export async function listarInsumos(): Promise<Insumo[]> {
    const response =
        await api.get<Insumo[]>("/insumos");

    return response.data;
}