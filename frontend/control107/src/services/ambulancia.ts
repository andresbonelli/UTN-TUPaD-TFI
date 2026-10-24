import { API_URL } from "./api";
import type { Ambulancia } from "../interfaces/Ambulancia";

const AMBULANCIAS_URL = `${API_URL}/ambulancias`;

export async function listarAmbulancias(): Promise<Ambulancia[]> {
  const response = await fetch(AMBULANCIAS_URL);

  if (!response.ok) {
    throw new Error("Error al obtener las ambulancias");
  }

  return response.json();
}