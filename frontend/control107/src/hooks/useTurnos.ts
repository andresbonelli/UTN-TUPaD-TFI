import { useQuery } from "@tanstack/react-query";

import type { Turno } from "../interfaces/Turno";
import {
  listarTurnos,
  listarTurnosActivos,
  listarTurnosPorEnfermero,
  obtenerTurno,
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
