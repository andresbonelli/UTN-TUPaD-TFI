import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type {
  CancelarTurnoRequest,
  IngresoEgresoRequest,
  ResumenTurnos,
  Turno,
  TurnoRequest,
  ActualizarTurnoRequest,
} from "../interfaces/Turno";

import {
  listarTurnos,
  listarTurnosActivos,
  listarTurnosPorEnfermero,
  obtenerResumenTurnos,
  obtenerTurno,
  registrarEgreso,
  registrarIngreso,
  cancelarTurno,
  crearTurno,
  actualizarTurno,
  obtenerResumenOperativo, 
} from "../services/turno";

import type { ResumenOperativo } from "../interfaces/ResumenOperativo";

export function useTurnos() {
  return useQuery<Turno[]>({
    queryKey: ["turnos"],
    queryFn: listarTurnos,
  });
}

export function useCrearTurno() {
  const queryClient = useQueryClient();

  return useMutation<
    Turno,
    Error,
    TurnoRequest
  >({
    mutationFn: crearTurno,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["turnos"],
      });
    },
  });
}


export function useTurno(id: number | null) {
  return useQuery<Turno>({
    queryKey: ["turnos", id],
    queryFn: () => obtenerTurno(id!),
    enabled: id !== null,
  });
}


export function useActualizarTurno() {
    const queryClient = useQueryClient();

    return useMutation<
        Turno,
        Error,
        {
            id: number;
            turno: ActualizarTurnoRequest;
        }
    >({
        mutationFn: ({ id, turno }) =>
            actualizarTurno(id, turno),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["turnos"],
            });
        },
    });
}

export function useTurnosActivos() {
  return useQuery<Turno[]>({
    queryKey: ["turnos", "activos"],
    queryFn: listarTurnosActivos,
  });
}

export function useResumenTurnos() {
  return useQuery<ResumenTurnos>({
    queryKey: ["turnos", "resumen"],
    queryFn: obtenerResumenTurnos,
  });
}

export function useTurnosPorEnfermero() {
  return useQuery<Turno[]>({
    queryKey: ["turnos", "enfermero"],
    queryFn: listarTurnosPorEnfermero,
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

export function useRegistrarEgreso() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    IngresoEgresoRequest
  >({
    mutationFn: registrarEgreso,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["turnos"],
      });
    },
  });
}

export function useCancelarTurno() {
  const queryClient = useQueryClient();

  return useMutation<
    Turno,
    Error,
    {
      turnoId: number;
      request: CancelarTurnoRequest;
    }
  >({
    mutationFn: ({ turnoId, request }) =>
      cancelarTurno(turnoId, request),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["turnos"],
      });
    },
  });
}

export function useResumenOperativo() {
    return useQuery<ResumenOperativo>({
        queryKey: ["resumen-operativo"],
        queryFn: obtenerResumenOperativo,
    });
}

