import { api } from "./api";

import type {
    Categoria,
    CategoriaRequest,
} from "../interfaces/Categoria";

export async function listarCategorias(): Promise<
    Categoria[]
> {
    const response =
        await api.get<Categoria[]>("/categorias");

    return response.data;
}

export async function crearCategoria(
    categoria: CategoriaRequest
): Promise<Categoria> {
    const response =
        await api.post<Categoria>(
            "/categorias",
            categoria
        );

    return response.data;
}

export async function actualizarCategoria(
    id: number,
    categoria: CategoriaRequest
): Promise<Categoria> {
    const response =
        await api.put<Categoria>(
            `/categorias/${id}`,
            categoria
        );

    return response.data;
}

export async function eliminarCategoria(
    id: number
): Promise<void> {
    await api.delete(
        `/categorias/${id}`
    );
}