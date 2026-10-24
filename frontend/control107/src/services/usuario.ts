import { API_URL } from "./api";
import type { Usuario } from "../interfaces/Usuario";

const USUARIOS_URL = `${API_URL}/usuarios`;

export async function listarUsuarios(): Promise<Usuario[]> {
  const response = await fetch(USUARIOS_URL);

  if (!response.ok) {
    throw new Error("Error al obtener los usuarios");
  }

  return response.json();
}