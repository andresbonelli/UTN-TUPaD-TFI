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
    cantidadEgreso: number;
    ingresoFaltante: number;
    cantidadUsada: number;
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

    observacionesIngreso: string;
    observacionesEgreso: string;

    controlInsumos: ControlInsumo[];
}