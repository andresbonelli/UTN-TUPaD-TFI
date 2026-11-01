import type { Insumo } from "./Insumo";

export interface Ambulancia {
    id: number;
    patente: string;
    disponible: boolean;
    insumos: Insumo[];
}

export interface AmbulanciaRequest {
    patente: string;
    disponible: boolean;
    insumos: number[];
}