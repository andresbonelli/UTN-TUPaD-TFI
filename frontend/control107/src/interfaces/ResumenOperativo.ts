import type { Turno } from "./Turno";

export interface ResumenOperativo {
    turnosActivos: number;
    ambulanciasDisponibles: number;
    ambulanciasTotales: number;
    alertas: number;
    turnosConInconsistencias: Turno[];
}