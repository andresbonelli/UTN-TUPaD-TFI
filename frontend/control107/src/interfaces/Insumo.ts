export interface Insumo {
  id: number;
  nombre: string;
  categoria: string;
  puntoControl: number;
  critico: boolean; //no aparece como "esCritico" en el endpoint
}

export interface InsumoRequest {
    nombre: string;
    categoriaId: number;
    puntoControl: number;
    critico: boolean;
}