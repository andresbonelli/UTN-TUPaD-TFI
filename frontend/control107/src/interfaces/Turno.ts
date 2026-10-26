import type { Usuario } from "./Usuario";
import type { Ambulancia } from "./Ambulancia";

export type HorarioTurno =
    | "MANIANA"
    | "TARDE"
    | "NOCHE";

export type EstadoTurno =
    | "PROGRAMADO"
    | "EN_CURSO"
    | "FINALIZADO"
    | "CANCELADO";

export interface ControlInsumo {
    nombre: string;
    categoria: string;
    esCritico: boolean;

    cantidadIngreso: number;
    cantidadEgreso: number | null;

    ingresoFaltante: number;

    cantidadUsada: number | null;
    cantidadRestockeo: number;
}
export interface Turno {
    id: number;
    fecha: string;
    horario: HorarioTurno;
    estado: EstadoTurno;

    admin: Usuario;
    enfermero: Usuario;

    medico: string;
    chofer: string;

    ambulancia: Ambulancia;

    observacionesIngreso: string | null;
    observacionesEgreso: string | null;

    controlInsumos: ControlInsumo[];
}

export interface ControlInsumoRequest {
  id: number;
  cantidad: number;
  cantidadRestockeo: number;
}

export interface IngresoEgresoRequest {
  turnoId: number;
  insumos: ControlInsumoRequest[];
  observaciones: string;
}

export interface CancelarTurnoRequest {
  observaciones: string;
}