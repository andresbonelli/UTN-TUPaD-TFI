import { API_URL } from "./api";
import type { Categoria } from "../interfaces/Categoria";


const CATEGORIAS_URL = `${API_URL}/categorias`;

export async function listarCategorias(): Promise<Categoria[]>{
    const response = await fetch(CATEGORIAS_URL);


if (!response.ok){
    throw new Error("Error al obtener las categorias");
}

return response.json();
}