import { useQuery } from "@tanstack/react-query";
import type { Categoria } from "../interfaces/Categoria";
import { listarCategorias } from "../services/categoria";

export function useCategorias() {
  return useQuery<Categoria[]>({
    queryKey: ["categorias"],
    queryFn: listarCategorias,
  });
}