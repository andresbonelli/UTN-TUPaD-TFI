import { API_URL } from "./api";
import type { Insumo } from "../interfaces/Insumo";

const INSUMOS_URL = `${API_URL}/insumos`;

export async function listarInsumos(): Promise<Insumo[]> {
  const response = await fetch(INSUMOS_URL);

  if (!response.ok) {
    throw new Error("Error al obtener los insumos");
  }

  return response.json();
}