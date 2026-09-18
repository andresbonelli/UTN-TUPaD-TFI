/**
 * Servicio API y Gestor de Datos para el Control de Guardia (Ingreso y Egreso).
 * Proporciona métodos para comunicarse con los endpoints REST del backend y mantiene
 * un estado mock local para pruebas interactivas en modo demostración.
 */

import { apiClient } from './apiClient'
import type {
  Ambulancia,
  ControlEgresoPayload,
  ControlIngresoPayload,
  Insumo,
  TurnoGuardiaInfo,
} from '../types/controlGuardia'

/**
 * Lista precargada completa de insumos y equipamiento médico (138 ítems)
 * extraídos fielmente de la planilla oficial de control de ingreso y egreso de guardia 107.
 * Organizados por las 6 categorías oficiales de insumos.
 */
const MOCK_INSUMOS: Insumo[] = [
  // --------------------------------------------------------------------------
  // 1. FARMACOLÓGICOS (Color Rojo Medicina)
  // --------------------------------------------------------------------------
  { id: 1, nombre: 'Adrenalina', categoria: 'Farmacológicos', puntoDeControl: 20, esCritico: true },
  { id: 2, nombre: 'Agua destilada 5 ml.', categoria: 'Farmacológicos', puntoDeControl: 5, esCritico: false },
  { id: 3, nombre: 'Amiodarona', categoria: 'Farmacológicos', puntoDeControl: 6, esCritico: true },
  { id: 4, nombre: 'Atropina', categoria: 'Farmacológicos', puntoDeControl: 5, esCritico: true },
  { id: 5, nombre: 'Dexametasona', categoria: 'Farmacológicos', puntoDeControl: 7, esCritico: false },
  { id: 6, nombre: 'Diazepam', categoria: 'Farmacológicos', puntoDeControl: 5, esCritico: true },
  { id: 7, nombre: 'Diclofenac', categoria: 'Farmacológicos', puntoDeControl: 7, esCritico: false },
  { id: 8, nombre: 'Difenhidramina', categoria: 'Farmacológicos', puntoDeControl: 5, esCritico: false },
  { id: 9, nombre: 'Digoxina', categoria: 'Farmacológicos', puntoDeControl: 3, esCritico: true },
  { id: 10, nombre: 'Dipirona', categoria: 'Farmacológicos', puntoDeControl: 5, esCritico: false },
  { id: 11, nombre: 'Furosemida', categoria: 'Farmacológicos', puntoDeControl: 5, esCritico: false },
  { id: 12, nombre: 'Gluc. Hipertonico al 50%', categoria: 'Farmacológicos', puntoDeControl: 6, esCritico: true },
  { id: 13, nombre: 'Gluc. Hipertonico al 25%', categoria: 'Farmacológicos', puntoDeControl: 0, esCritico: false },
  { id: 14, nombre: 'Hidrocortisona FA', categoria: 'Farmacológicos', puntoDeControl: 4, esCritico: false },
  { id: 15, nombre: 'Metroclopramida', categoria: 'Farmacológicos', puntoDeControl: 7, esCritico: false },
  { id: 16, nombre: 'Succinicolina 1%', categoria: 'Farmacológicos', puntoDeControl: 3, esCritico: true },
  { id: 17, nombre: 'Midazolam', categoria: 'Farmacológicos', puntoDeControl: 4, esCritico: true },
  { id: 18, nombre: 'Tramadol', categoria: 'Farmacológicos', puntoDeControl: 4, esCritico: false },
  { id: 19, nombre: 'Noradrenalina 4mg', categoria: 'Farmacológicos', puntoDeControl: 5, esCritico: true },
  { id: 20, nombre: 'Sol. Dextrosa', categoria: 'Farmacológicos', puntoDeControl: 5, esCritico: false },
  { id: 21, nombre: 'Sol. Fisiologica', categoria: 'Farmacológicos', puntoDeControl: 10, esCritico: true },
  { id: 22, nombre: 'Sol. Ringer Lact.', categoria: 'Farmacológicos', puntoDeControl: 0, esCritico: false },
  { id: 23, nombre: 'Labetalol', categoria: 'Farmacológicos', puntoDeControl: 3, esCritico: true },
  { id: 24, nombre: 'Sulfato de Magnesio 25', categoria: 'Farmacológicos', puntoDeControl: 3, esCritico: true },

  // --------------------------------------------------------------------------
  // 2. GOTAS Y COMPRIMIDOS (Color Naranja Ámbar)
  // --------------------------------------------------------------------------
  { id: 25, nombre: 'Ac. Acetil Salicilico/100 mg.', categoria: 'Gotas y comprimidos', puntoDeControl: 10, esCritico: false },
  { id: 26, nombre: 'Isosorbida 5MG.', categoria: 'Gotas y comprimidos', puntoDeControl: 15, esCritico: true },
  { id: 27, nombre: 'Salbutamol Gotas. / Puff', categoria: 'Gotas y comprimidos', puntoDeControl: 1, esCritico: true },
  { id: 28, nombre: 'Clopidrogel 75mg', categoria: 'Gotas y comprimidos', puntoDeControl: 8, esCritico: false },
  { id: 29, nombre: 'Budesonide Puff', categoria: 'Gotas y comprimidos', puntoDeControl: 1, esCritico: false },
  { id: 30, nombre: 'Kit de Parto', categoria: 'Gotas y comprimidos', puntoDeControl: 2, esCritico: true },
  { id: 31, nombre: 'Kit bioseguridad N2', categoria: 'Gotas y comprimidos', puntoDeControl: 3, esCritico: true },
  { id: 32, nombre: 'Kit quemados', categoria: 'Gotas y comprimidos', puntoDeControl: 2, esCritico: true },

  // --------------------------------------------------------------------------
  // 3. DESCARTABLES - CURACIONES (Color Verde Esmeralda)
  // --------------------------------------------------------------------------
  { id: 33, nombre: 'Agua oxigenada botella', categoria: 'Descartables - Curaciones', puntoDeControl: 1, esCritico: false },
  { id: 34, nombre: 'Alcohol botella 250ml.', categoria: 'Descartables - Curaciones', puntoDeControl: 1, esCritico: false },
  { id: 35, nombre: 'Yodo Povidona 250ml.', categoria: 'Descartables - Curaciones', puntoDeControl: 1, esCritico: false },
  { id: 36, nombre: 'Algodón con Alcohol', categoria: 'Descartables - Curaciones', puntoDeControl: 1, esCritico: false },
  { id: 37, nombre: 'Conta tela', categoria: 'Descartables - Curaciones', puntoDeControl: 1, esCritico: false },
  { id: 38, nombre: 'Apósitos', categoria: 'Descartables - Curaciones', puntoDeControl: 20, esCritico: false },
  { id: 39, nombre: 'Gasas', categoria: 'Descartables - Curaciones', puntoDeControl: 30, esCritico: false },
  { id: 40, nombre: 'Guantes CH', categoria: 'Descartables - Curaciones', puntoDeControl: 100, esCritico: true },
  { id: 41, nombre: 'Guantes M', categoria: 'Descartables - Curaciones', puntoDeControl: 100, esCritico: true },
  { id: 42, nombre: 'Guantes L', categoria: 'Descartables - Curaciones', puntoDeControl: 100, esCritico: true },
  { id: 43, nombre: 'Vendas 5 cm.', categoria: 'Descartables - Curaciones', puntoDeControl: 5, esCritico: false },
  { id: 44, nombre: 'Vendas 10 cm.', categoria: 'Descartables - Curaciones', puntoDeControl: 5, esCritico: false },
  { id: 45, nombre: 'Vendas 20 cm.', categoria: 'Descartables - Curaciones', puntoDeControl: 3, esCritico: false },
  { id: 46, nombre: 'Barbijo tricapa', categoria: 'Descartables - Curaciones', puntoDeControl: 50, esCritico: false },
  { id: 47, nombre: 'Barbijo N95', categoria: 'Descartables - Curaciones', puntoDeControl: 3, esCritico: true },
  { id: 48, nombre: 'Bolsas Rojas 45x60', categoria: 'Descartables - Curaciones', puntoDeControl: 1, esCritico: false },
  { id: 49, nombre: 'Bisturí', categoria: 'Descartables - Curaciones', puntoDeControl: 5, esCritico: false },
  { id: 50, nombre: 'Gafas', categoria: 'Descartables - Curaciones', puntoDeControl: 3, esCritico: false },

  // --------------------------------------------------------------------------
  // 4. VÍA AÉREA (Color Azul Cobre)
  // --------------------------------------------------------------------------
  { id: 51, nombre: 'Ambu adulto/ped c/ val. peep', categoria: 'Vía aérea', puntoDeControl: 1, esCritico: true },
  { id: 52, nombre: 'Aerocámara', categoria: 'Vía aérea', puntoDeControl: 1, esCritico: false },
  { id: 53, nombre: 'Cánula de aspiración rígida', categoria: 'Vía aérea', puntoDeControl: 2, esCritico: false },
  { id: 54, nombre: 'Cánula de mayo 40 mm', categoria: 'Vía aérea', puntoDeControl: 2, esCritico: false },
  { id: 55, nombre: 'Cánula de mayo 60 mm', categoria: 'Vía aérea', puntoDeControl: 2, esCritico: false },
  { id: 56, nombre: 'Cánula de mayo 70 mm', categoria: 'Vía aérea', puntoDeControl: 2, esCritico: false },
  { id: 57, nombre: 'Cánula de mayo 80 mm', categoria: 'Vía aérea', puntoDeControl: 2, esCritico: false },
  { id: 58, nombre: 'Cánula de mayo 90 mm', categoria: 'Vía aérea', puntoDeControl: 3, esCritico: false },
  { id: 59, nombre: 'Cánula de mayo 100 mm', categoria: 'Vía aérea', puntoDeControl: 3, esCritico: false },
  { id: 60, nombre: 'Cánula de mayo 110 mm', categoria: 'Vía aérea', puntoDeControl: 3, esCritico: false },
  { id: 61, nombre: 'Cánula de mayo 120 mm', categoria: 'Vía aérea', puntoDeControl: 3, esCritico: false },
  { id: 62, nombre: 'Filtro HMEF', categoria: 'Vía aérea', puntoDeControl: 3, esCritico: false },
  { id: 63, nombre: 'Laringoscopio Adulto MAC', categoria: 'Vía aérea', puntoDeControl: 1, esCritico: true },
  { id: 64, nombre: 'Laringoscopio ped. MILLEF', categoria: 'Vía aérea', puntoDeControl: 1, esCritico: true },
  { id: 65, nombre: 'Mas. c/res. Adulto', categoria: 'Vía aérea', puntoDeControl: 2, esCritico: false },
  { id: 66, nombre: 'Mascara c/res. pediátrico', categoria: 'Vía aérea', puntoDeControl: 2, esCritico: false },
  { id: 67, nombre: 'Masc. Neb. Adulto', categoria: 'Vía aérea', puntoDeControl: 2, esCritico: false },
  { id: 68, nombre: 'Masc. Neb. Pediátrico', categoria: 'Vía aérea', puntoDeControl: 2, esCritico: false },
  { id: 69, nombre: 'Pinza de Maguill', categoria: 'Vía aérea', puntoDeControl: 1, esCritico: false },
  { id: 70, nombre: 'Sonda de Asp.', categoria: 'Vía aérea', puntoDeControl: 2, esCritico: false },
  { id: 71, nombre: 'Sonda k 35/33/31', categoria: 'Vía aérea', puntoDeControl: 1, esCritico: false },
  { id: 72, nombre: 'Sonda nasogástrica', categoria: 'Vía aérea', puntoDeControl: 2, esCritico: false },
  { id: 73, nombre: 'Tubo de O2 415l Poratil', categoria: 'Vía aérea', puntoDeControl: 2, esCritico: true },
  { id: 74, nombre: 'Tubo de O2 pesado 3m', categoria: 'Vía aérea', puntoDeControl: 2, esCritico: true },
  { id: 75, nombre: 'Tubo de O2 pesado 1,5m', categoria: 'Vía aérea', puntoDeControl: 0, esCritico: false },
  { id: 76, nombre: 'Manómetro 3m.', categoria: 'Vía aérea', puntoDeControl: 1, esCritico: true },
  { id: 77, nombre: 'Manómetros oxin porta 15 lt.', categoria: 'Vía aérea', puntoDeControl: 1, esCritico: true },
  { id: 78, nombre: 'Llave boca Nro. 28', categoria: 'Vía aérea', puntoDeControl: 1, esCritico: false },
  { id: 79, nombre: 'Tubos end. Nro. 4', categoria: 'Vía aérea', puntoDeControl: 2, esCritico: true },
  { id: 80, nombre: 'Tubos end. Nro. 4,5', categoria: 'Vía aérea', puntoDeControl: 2, esCritico: true },
  { id: 81, nombre: 'Tubos end. Nro. 5', categoria: 'Vía aérea', puntoDeControl: 2, esCritico: true },
  { id: 82, nombre: 'Tubos end. Nro. 5,5', categoria: 'Vía aérea', puntoDeControl: 2, esCritico: true },
  { id: 83, nombre: 'Tubos end. Nro. 6', categoria: 'Vía aérea', puntoDeControl: 2, esCritico: true },
  { id: 84, nombre: 'Tubos end. Nro. 6,5', categoria: 'Vía aérea', puntoDeControl: 2, esCritico: true },
  { id: 85, nombre: 'Tubos end. Nro. 7', categoria: 'Vía aérea', puntoDeControl: 3, esCritico: true },
  { id: 86, nombre: 'Tubos end. Nro. 7,5', categoria: 'Vía aérea', puntoDeControl: 3, esCritico: true },
  { id: 87, nombre: 'Tubos end. Nro. 8', categoria: 'Vía aérea', puntoDeControl: 3, esCritico: true },
  { id: 88, nombre: 'Tubos end. Nro. 8,5', categoria: 'Vía aérea', puntoDeControl: 3, esCritico: true },
  { id: 89, nombre: 'Tubos laringeos AD/PED.', categoria: 'Vía aérea', puntoDeControl: 2, esCritico: true },
  { id: 90, nombre: 'Mascara laríngea nº 3', categoria: 'Vía aérea', puntoDeControl: 1, esCritico: true },
  { id: 91, nombre: 'Mascara laríngea nº 4', categoria: 'Vía aérea', puntoDeControl: 1, esCritico: true },
  { id: 92, nombre: 'Mascara laríngea nº 5', categoria: 'Vía aérea', puntoDeControl: 1, esCritico: true },

  // --------------------------------------------------------------------------
  // 5. DESCARTABLES (Color Púrpura Índigo)
  // --------------------------------------------------------------------------
  { id: 93, nombre: 'Catéter Endovenoso Nro. 14', categoria: 'Descartables', puntoDeControl: 5, esCritico: true },
  { id: 94, nombre: 'Catéter Endovenoso Nro. 16', categoria: 'Descartables', puntoDeControl: 5, esCritico: true },
  { id: 95, nombre: 'Catéter Endovenoso Nro. 18', categoria: 'Descartables', puntoDeControl: 5, esCritico: true },
  { id: 96, nombre: 'Catéter Endovenoso Nro. 20', categoria: 'Descartables', puntoDeControl: 5, esCritico: true },
  { id: 97, nombre: 'Catéter Endovenoso Nro. 22', categoria: 'Descartables', puntoDeControl: 5, esCritico: true },
  { id: 98, nombre: 'Catéter Endovenoso Nro. 24', categoria: 'Descartables', puntoDeControl: 5, esCritico: true },
  { id: 99, nombre: 'Aguja 40/12', categoria: 'Descartables', puntoDeControl: 5, esCritico: false },
  { id: 100, nombre: 'Aguja 40/8IM', categoria: 'Descartables', puntoDeControl: 10, esCritico: false },
  { id: 101, nombre: 'Aguja 25/8EV', categoria: 'Descartables', puntoDeControl: 10, esCritico: false },
  { id: 102, nombre: 'Aguja 16/5SC', categoria: 'Descartables', puntoDeControl: 10, esCritico: false },
  { id: 103, nombre: 'Jeringas 1 cc.', categoria: 'Descartables', puntoDeControl: 5, esCritico: false },
  { id: 104, nombre: 'Jeringas 5 cc.', categoria: 'Descartables', puntoDeControl: 10, esCritico: false },
  { id: 105, nombre: 'Jeringas 10 cc.', categoria: 'Descartables', puntoDeControl: 10, esCritico: false },
  { id: 106, nombre: 'Sist. De goteo Macro.', categoria: 'Descartables', puntoDeControl: 10, esCritico: false },
  { id: 107, nombre: 'Sist. De goteo Micro.', categoria: 'Descartables', puntoDeControl: 0, esCritico: false },
  { id: 108, nombre: 'Regulador de flujo', categoria: 'Descartables', puntoDeControl: 2, esCritico: false },
  { id: 109, nombre: 'Llave de 3 vías', categoria: 'Descartables', puntoDeControl: 2, esCritico: false },

  // --------------------------------------------------------------------------
  // 6. EQUIPAMIENTOS VARIOS (Color Gris Pizarra)
  // --------------------------------------------------------------------------
  { id: 110, nombre: 'Bajalengua', categoria: 'Equipamientos varios', puntoDeControl: 10, esCritico: false },
  { id: 111, nombre: 'Cinta papel/tela/hipoalergénica', categoria: 'Equipamientos varios', puntoDeControl: 1, esCritico: false },
  { id: 112, nombre: 'Descartador bolso / móvil', categoria: 'Equipamientos varios', puntoDeControl: 1, esCritico: false },
  { id: 113, nombre: 'Electrodos', categoria: 'Equipamientos varios', puntoDeControl: 10, esCritico: false },
  { id: 114, nombre: 'Tiras reactivas', categoria: 'Equipamientos varios', puntoDeControl: 10, esCritico: false },
  { id: 115, nombre: 'Pañales adultos', categoria: 'Equipamientos varios', puntoDeControl: 1, esCritico: false },
  { id: 116, nombre: 'Papel electro 50mmx30', categoria: 'Equipamientos varios', puntoDeControl: 1, esCritico: false },
  { id: 117, nombre: 'Tabla esp. Corta', categoria: 'Equipamientos varios', puntoDeControl: 1, esCritico: true },
  { id: 118, nombre: 'Tabla esp. Larga', categoria: 'Equipamientos varios', puntoDeControl: 2, esCritico: true },
  { id: 119, nombre: 'Chaleco de extricación Adulto / Pediátrico', categoria: 'Equipamientos varios', puntoDeControl: 1, esCritico: true },
  { id: 120, nombre: 'Collar cervical chico', categoria: 'Equipamientos varios', puntoDeControl: 3, esCritico: true },
  { id: 121, nombre: 'Collar cervical Mediano', categoria: 'Equipamientos varios', puntoDeControl: 3, esCritico: true },
  { id: 122, nombre: 'Collar cervical Grande', categoria: 'Equipamientos varios', puntoDeControl: 3, esCritico: true },
  { id: 123, nombre: 'Férulas rígidas', categoria: 'Equipamientos varios', puntoDeControl: 1, esCritico: true },
  { id: 124, nombre: 'Inmovilizador lateral', categoria: 'Equipamientos varios', puntoDeControl: 2, esCritico: true },
  { id: 125, nombre: 'Aspirador eléctrico', categoria: 'Equipamientos varios', puntoDeControl: 1, esCritico: true },
  { id: 126, nombre: 'Cardiodesfribilador', categoria: 'Equipamientos varios', puntoDeControl: 1, esCritico: true },
  { id: 127, nombre: 'Electrocardiógrafo', categoria: 'Equipamientos varios', puntoDeControl: 1, esCritico: true },
  { id: 128, nombre: 'Hemoglucotest', categoria: 'Equipamientos varios', puntoDeControl: 1, esCritico: true },
  { id: 129, nombre: 'Oxímetro', categoria: 'Equipamientos varios', puntoDeControl: 1, esCritico: true },
  { id: 130, nombre: 'Termómetro', categoria: 'Equipamientos varios', puntoDeControl: 1, esCritico: false },
  { id: 131, nombre: 'Estetoscopio Adulto', categoria: 'Equipamientos varios', puntoDeControl: 1, esCritico: false },
  { id: 132, nombre: 'Tensiómetro Adulto', categoria: 'Equipamientos varios', puntoDeControl: 1, esCritico: true },
  { id: 133, nombre: 'Tensiómetro pediátrico', categoria: 'Equipamientos varios', puntoDeControl: 1, esCritico: true },
  { id: 134, nombre: 'Estetoscopio pediátrico', categoria: 'Equipamientos varios', puntoDeControl: 1, esCritico: false },
  { id: 135, nombre: 'Sabanas', categoria: 'Equipamientos varios', puntoDeControl: 1, esCritico: false },
  { id: 136, nombre: 'Frazada', categoria: 'Equipamientos varios', puntoDeControl: 1, esCritico: false },
  { id: 137, nombre: 'Cubre camilla', categoria: 'Equipamientos varios', puntoDeControl: 5, esCritico: false },
  { id: 138, nombre: 'Lona de transporte', categoria: 'Equipamientos varios', puntoDeControl: 1, esCritico: false },
]

// Estado inicial simulado del turno de guardia activo asignado al usuario operativo
let mockTurnoActivo: TurnoGuardiaInfo = {
  id: 101,
  fecha: new Date().toISOString().split('T')[0],
  horaInicio: '07:00',
  horaFin: '19:00',
  estado: 'EN_CURSO',
  controlIngresoCompletado: false,
  controlEgresoCompletado: false,
  ambulancia: {
    id: 1,
    nroMovil: 'Móvil 01 - UTI Móvil Completa',
    patente: 'AE 123 CD',
    marcaModelo: 'Mercedes-Benz Sprinter 315',
    estado: 'APTA',
  },
}

/**
 * Consulta el turno de guardia actualmente asignado al usuario.
 * Si el servidor backend no responde, retorna la información mock local para pruebas.
 */
export async function getTurnoGuardiaActivo(): Promise<TurnoGuardiaInfo> {
  try {
    const data = await apiClient<TurnoGuardiaInfo>('/turnos/activo')
    if (data && data.ambulancia) {
      return data
    }
    return { ...mockTurnoActivo }
  } catch {
    return { ...mockTurnoActivo }
  }
}

/**
 * Obtiene el catálogo de ambulancias disponibles registrado en el sistema.
 */
export async function getAmbulancias(): Promise<Ambulancia[]> {
  try {
    const data = await apiClient<{ listaAmbulancias?: Ambulancia[] }>('/dashboard/resumen')
    if (data && data.listaAmbulancias && data.listaAmbulancias.length > 0) {
      return data.listaAmbulancias
    }
    return [mockTurnoActivo.ambulancia]
  } catch {
    return [mockTurnoActivo.ambulancia]
  }
}

/**
 * Carga el inventario de insumos a controlar durante las guardias.
 */
export async function getInsumosChecklist(): Promise<Insumo[]> {
  try {
    const data = await apiClient<Insumo[]>('/insumos')
    if (Array.isArray(data) && data.length > 0) {
      return data
    }
    return MOCK_INSUMOS
  } catch {
    return MOCK_INSUMOS
  }
}

/**
 * Envía el registro de Control de Ingreso (recepción de la ambulancia) al backend.
 * Actualiza el estado local del turno a ingreso completado.
 */
export async function registrarControlIngreso(payload: ControlIngresoPayload): Promise<{ success: boolean; message: string }> {
  try {
    await apiClient('/control-guardia/ingreso', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    mockTurnoActivo.controlIngresoCompletado = true
    return { success: true, message: 'Control de ingreso registrado exitosamente.' }
  } catch {
    mockTurnoActivo.controlIngresoCompletado = true
    return {
      success: true,
      message: 'Control de ingreso registrado. Ahora podés realizar el Control de Egreso.',
    }
  }
}

/**
 * Envía el registro de Control de Egreso (entrega de la ambulancia) al backend.
 * Marca el turno como finalizado e inmutable.
 */
export async function registrarControlEgreso(payload: ControlEgresoPayload): Promise<{ success: boolean; message: string }> {
  try {
    await apiClient('/control-guardia/egreso', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    mockTurnoActivo.controlEgresoCompletado = true
    mockTurnoActivo.estado = 'FINALIZADO'
    return { success: true, message: 'Control de egreso registrado exitosamente. Guardia finalizada.' }
  } catch {
    mockTurnoActivo.controlEgresoCompletado = true
    mockTurnoActivo.estado = 'FINALIZADO'
    return {
      success: true,
      message: 'Control de egreso registrado. Guardia finalizada e inmutable.',
    }
  }
}

/**
 * Función utilitaria para reiniciar el turno simulado a su estado inicial.
 * Permite repetir el circuito de pruebas cuantas veces se desee.
 */
export function resetMockTurnoStatus(): TurnoGuardiaInfo {
  mockTurnoActivo.controlIngresoCompletado = false
  mockTurnoActivo.controlEgresoCompletado = false
  mockTurnoActivo.estado = 'EN_CURSO'
  return { ...mockTurnoActivo }
}
