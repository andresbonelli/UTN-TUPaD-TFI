import { API_URL } from "./api";
import type {
  IngresoEgresoRequest,
  Turno,
} from "../interfaces/Turno";

const TURNOS_URL = `${API_URL}/turnos`;

export async function listarTurnos(): Promise<Turno[]> {
    const response = await fetch(TURNOS_URL);

    if (!response.ok) {
        throw new Error("Error al obtener los turnos");
    }

    return response.json();
}

export async function obtenerTurno(
    id: number
): Promise<Turno> {
    const response = await fetch(
        `${TURNOS_URL}/${id}`
    );

    if (!response.ok) {
        throw new Error("Error al obtener el turno");
    }

    return response.json();
}

export async function listarTurnosActivos(): Promise<Turno[]> {
  const response = await fetch(`${TURNOS_URL}/activos`);

  if (!response.ok) {
    throw new Error("Error al obtener los turnos activos");
  }

  return response.json();
}

export async function listarTurnosPorEnfermero(
  enfermeroId: number
): Promise<Turno[]> {
  const response = await fetch(
    `${TURNOS_URL}/enfermero/${enfermeroId}`
  );

  if (!response.ok) {
    throw new Error(
      "Error al obtener los turnos del enfermero"
    );
  }

  return response.json();
}

export async function registrarIngreso(
  ingreso: IngresoEgresoRequest
): Promise<void> {
  const response = await fetch(`${TURNOS_URL}/ingreso`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ingreso),
  });

  if (!response.ok) {
    throw new Error(
      "Error al registrar el control de ingreso"
    );
  }
}

export async function registrarEgreso(
  egreso: IngresoEgresoRequest
): Promise<void> {
  const response = await fetch(`${TURNOS_URL}/egreso`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(egreso),
  });

  if (!response.ok) {
    throw new Error(
      "Error al registrar el control de egreso"
    );
  }
}