import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Categoria, CategoriaRequest } from "../interfaces/Categoria";
import { crearCategoria, listarCategorias, actualizarCategoria } from "../services/categoria"

export function useCategorias() {
  return useQuery<Categoria[]>({
    queryKey: ["categorias"],
    queryFn: listarCategorias,
  });
}

export function useCrearCategoria() {
  const queryClient = useQueryClient();

  return useMutation<
    Categoria,
    Error,
    CategoriaRequest
  >({
    mutationFn: crearCategoria,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categorias"],
      });
    },

    onError: (error) => {
      console.error(
        "Error al crear la categoría:",
        error
      );
    },
  });
}

export function useActualizarCategoria() {
  const queryClient = useQueryClient();

  return useMutation<
    Categoria,
    Error,
    {
      id: number;
      categoria: CategoriaRequest;
    }
  >({
    mutationFn: ({ id, categoria }) =>
      actualizarCategoria(id, categoria),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categorias"],
      });
    },

    onError: (error) => {
      console.error(
        "Error al actualizar la categoría:",
        error
      );
    },
  });
}