import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type {
  IngresoEgresoRequest,
  Turno,
} from "../interfaces/Turno";

import {
  listarTurnos,
  listarTurnosActivos,
  listarTurnosPorEnfermero,
  obtenerTurno,
  registrarIngreso,
} from "../services/turno";

export function useTurnos() {
  return useQuery<Turno[]>({
    queryKey: ["turnos"],
    queryFn: listarTurnos,
  });
}

export function useTurno(id: number) {
  return useQuery<Turno>({
    queryKey: ["turnos", id],
    queryFn: () => obtenerTurno(id),
  });
}

export function useTurnosActivos() {
  return useQuery<Turno[]>({
    queryKey: ["turnos", "activos"],
    queryFn: listarTurnosActivos,
  });
}

export function useTurnosPorEnfermero(
  enfermeroId: number
) {
  return useQuery<Turno[]>({
    queryKey: [
      "turnos",
      "enfermero",
      enfermeroId,
    ],
    queryFn: () =>
      listarTurnosPorEnfermero(enfermeroId),
  });
}

export function useRegistrarIngreso() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, IngresoEgresoRequest>({
    mutationFn: registrarIngreso,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["turnos"],
      });
    },
  });
}