import { useQuery } from "@tanstack/react-query";

import type { Insumo } from "../interfaces/Insumo";
import { listarInsumos } from "../services/insumo";

export function useInsumos() {
  return useQuery<Insumo[]>({
    queryKey: ["insumos"],
    queryFn: listarInsumos,
  });
}