/**
 * Estructuras de datos TypeScript para el módulo de Control de Guardia (Ingreso y Egreso).
 * Estas interfaces reflejan los modelos y DTOs definidos en la arquitectura backend de Java (Spring Boot).
 */

// Estructura de la unidad de emergencias asignada al servicio
export interface Ambulancia {
  id: number
  nroMovil: string
  patente: string
  marcaModelo: string
  estado: 'APTA' | 'EN_REPARACION' | 'FUERA_DE_SERVICIO'
}

// Definición de las 6 categorías oficiales de insumos según la planilla de guardia 107
export type CategoriaInsumo = 
  | 'Farmacológicos'
  | 'Gotas y comprimidos'
  | 'Descartables - Curaciones'
  | 'Vía aérea'
  | 'Descartables'
  | 'Equipamientos varios'

// Representa un insumo médico o equipamiento controlado en la guardia (alineado con la planilla oficial)
export interface Insumo {
  id: number
  nombre: string
  categoria: CategoriaInsumo | string // Categoría a la que pertenece el insumo para su agrupación por colores
  puntoDeControl: number // Cantidad base o stock esperado al recibir/entregar la unidad móvil
  esCritico: boolean // Indicador visual para medicamentos e insumos médicos de alta prioridad
}

// Representación del turno activo asignado al personal de salud
export interface TurnoGuardiaInfo {
  id: number
  fecha: string
  horaInicio: string
  horaFin: string
  estado: 'PROGRAMADO' | 'EN_CURSO' | 'FINALIZADO'
  controlIngresoCompletado: boolean // Estado del check-in al recibir el turno
  controlEgresoCompletado: boolean // Estado del check-out al finalizar el turno
  ambulancia: Ambulancia // Móvil asignado exclusivamente a este turno
}

// Detalle individual de cada insumo controlado al recibir la unidad (Ingreso)
export interface DetalleStockIngreso {
  insumoId: number
  insumoNombre: string
  cantidadEsperada: number
  cantidadRecibida: number
  observaciones?: string
}

// Detalle individual de cada insumo declarado al entregar la unidad (Egreso)
export interface DetalleStockEgreso {
  insumoId: number
  insumoNombre: string
  cantidadDejada: number
  observaciones?: string
}

// Objeto de envío (Payload) para registrar el Control de Ingreso
export interface ControlIngresoPayload {
  turnoGuardiaId: number
  ambulanciaId: number
  enfermeroNombre: string
  observacionesGenerales?: string
  detalles: DetalleStockIngreso[]
}

// Objeto de envío (Payload) para registrar el Control de Egreso
export interface ControlEgresoPayload {
  turnoGuardiaId: number
  ambulanciaId: number
  enfermeroNombre: string
  observacionesFinales?: string
  detalles: DetalleStockEgreso[]
}
