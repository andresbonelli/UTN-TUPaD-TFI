import { api } from "./api";

import type { Insumo, InsumoRequest } from "../interfaces/Insumo";

export async function listarInsumos(): Promise<Insumo[]> {
    const response =
        await api.get<Insumo[]>("/insumos");

    return response.data;
}

export async function crearInsumo(
    insumo: InsumoRequest
): Promise<Insumo> {
    const response =
        await api.post<Insumo>(
            "/insumos",
            insumo
        );

    return response.data;
}

export async function actualizarInsumo(
    id: number,
    insumo: InsumoRequest
): Promise<Insumo> {
    const response =
        await api.put<Insumo>(
            `/insumos/${id}`,
            insumo
        );

    return response.data;
}