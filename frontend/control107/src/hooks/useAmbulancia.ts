import { useQuery } from "@tanstack/react-query";

import type { Ambulancia } from "../interfaces/Ambulancia";
import { listarAmbulancias } from "../services/ambulancia";

export function useAmbulancias() {
  return useQuery<Ambulancia[]>({
    queryKey: ["ambulancias"],
    queryFn: listarAmbulancias,
  });
}