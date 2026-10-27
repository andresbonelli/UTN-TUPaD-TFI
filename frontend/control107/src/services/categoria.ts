import { api, API_URL } from "./api";
import type { Categoria, CategoriaRequest } from "../interfaces/Categoria";


//Se cambio el nombre a categoria.ts


const CATEGORIAS_URL = `${API_URL}/categorias`;

export async function listarCategorias(): Promise<Categoria[]> {
    const response = await api.get<Categoria[]>("/categorias");

    return response.data;
}

export async function crearCategoria(
    categoria: CategoriaRequest
): Promise<Categoria> {
    const response = await fetch(CATEGORIAS_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(categoria),
    });

    if (!response.ok) {
        throw new Error("Error al crear la categoría");
    }

    return response.json();
}