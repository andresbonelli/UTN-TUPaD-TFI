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