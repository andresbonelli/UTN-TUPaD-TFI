import { api } from "./api";

import type {
    CancelarTurnoRequest,
    IngresoEgresoRequest,
    ResumenTurnos,
    Turno,
    TurnoRequest,
} from "../interfaces/Turno";

export async function listarTurnos(): Promise<Turno[]> {
    const response = await api.get<Turno[]>("/turnos");

    return response.data;
}

export async function obtenerTurno(id: number): Promise<Turno> {
    const response = await api.get<Turno>(`/turnos/${id}`);

    return response.data;
}

export async function listarTurnosActivos(): Promise<Turno[]> {
    const response = await api.get<Turno[]>("/turnos/activos");

    return response.data;
}

export async function listarTurnosPorEnfermero(): Promise<Turno[]> {
    const response = await api.get<Turno[]>("/turnos/enfermero");
    return response.data;
}

export async function registrarIngreso(
    ingreso: IngresoEgresoRequest,
): Promise<void> {
    await api.post("/turnos/ingreso", ingreso);
}

export async function registrarEgreso(
    egreso: IngresoEgresoRequest,
): Promise<void> {
    await api.post("/turnos/egreso", egreso);
}

export async function cancelarTurno(
    turnoId: number,
    request: CancelarTurnoRequest,
): Promise<Turno> {
    const response = await api.post<Turno>(
        `/turnos/${turnoId}/cancelar`,
        request,
    );

    return response.data;
}

export async function obtenerResumenTurnos(): Promise<ResumenTurnos> {
    const response = await api.get<ResumenTurnos>("/turnos/resumen");

    return response.data;
}

export async function crearTurno(
    turno: TurnoRequest,
): Promise<Turno> {
    const response = await api.post<Turno>(
        "/turnos",
        turno,
    );

    return response.data;
}

export async function actualizarTurno(
    id: number,
    turno: TurnoRequest,
): Promise<Turno> {
    const response = await api.put<Turno>(
        `/turnos/${id}`,
        turno,
    );

    return response.data;
}