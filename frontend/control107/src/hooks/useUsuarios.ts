import { useQuery } from "@tanstack/react-query";

import type { Usuario } from "../interfaces/Usuario";
import { listarUsuarios } from "../services/usuario";

export function useUsuarios() {
  return useQuery<Usuario[]>({
    queryKey: ["usuarios"],
    queryFn: listarUsuarios,
  });
}