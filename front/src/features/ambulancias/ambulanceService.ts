export type OxygenState = 'Completo' | 'Revisar' | 'Crítico'

export interface OxygenStatus {
  currentPsi: number
  maxPsi: number
  state: OxygenState
}

export interface AmbulanceHistoryItem {
  id: string
  type: 'Ingreso' | 'Egreso' | 'Consumo'
  description: string
  date: string
  operator: string
}

export interface Ambulance {
  id: string
  name: string
  base: string
  status: 'Disponible' | 'En servicio' | 'En revisión'
  lastCheck: string
  crew: string
  oxygen: OxygenStatus
  history: AmbulanceHistoryItem[]
}

const ambulances: Ambulance[] = [
  {
    id: 'movil-03',
    name: 'Móvil 03',
    base: 'Base central',
    status: 'Disponible',
    lastCheck: 'Hoy, 07:40',
    crew: 'Guardia A',
    oxygen: { currentPsi: 2000, maxPsi: 2200, state: 'Completo' },
    history: [
      { id: '03-1', type: 'Ingreso', description: 'Control de rutina completado', date: 'Hoy, 07:40', operator: 'M. Sosa' },
      { id: '03-2', type: 'Consumo', description: '2 kits de trauma descontados', date: 'Ayer, 19:15', operator: 'L. Vera' },
      { id: '03-3', type: 'Egreso', description: 'Unidad liberada para servicio', date: 'Ayer, 18:50', operator: 'M. Sosa' },
    ],
  },
  {
    id: 'movil-07',
    name: 'Móvil 07',
    base: 'En ruta - Zona Norte',
    status: 'En servicio',
    lastCheck: 'Hoy, 06:55',
    crew: 'Guardia B',
    oxygen: { currentPsi: 1580, maxPsi: 2200, state: 'Revisar' },
    history: [
      { id: '07-1', type: 'Egreso', description: 'Salida a servicio #4582', date: 'Hoy, 08:12', operator: 'R. Molina' },
      { id: '07-2', type: 'Ingreso', description: 'Chequeo previo a la salida', date: 'Hoy, 06:55', operator: 'R. Molina' },
      { id: '07-3', type: 'Consumo', description: '1 tubo de oxígeno reportado', date: 'Ayer, 22:30', operator: 'A. Ruiz' },
    ],
  },
  {
    id: 'movil-12',
    name: 'Móvil 12',
    base: 'Taller interno',
    status: 'En revisión',
    lastCheck: 'Ayer, 21:10',
    crew: 'Sin asignar',
    oxygen: { currentPsi: 520, maxPsi: 2200, state: 'Crítico' },
    history: [
      { id: '12-1', type: 'Ingreso', description: 'Unidad ingresada a revisión', date: 'Ayer, 21:10', operator: 'D. Paz' },
      { id: '12-2', type: 'Consumo', description: 'Presión de oxígeno debajo del mínimo', date: 'Ayer, 20:45', operator: 'D. Paz' },
    ],
  },
  {
    id: 'movil-18',
    name: 'Móvil 18',
    base: 'Base central',
    status: 'Disponible',
    lastCheck: 'Hoy, 08:05',
    crew: 'Guardia A',
    oxygen: { currentPsi: 2150, maxPsi: 2200, state: 'Completo' },
    history: [
      { id: '18-1', type: 'Ingreso', description: 'Control de ingreso aprobado', date: 'Hoy, 08:05', operator: 'C. Núñez' },
      { id: '18-2', type: 'Egreso', description: 'Unidad disponible en base', date: 'Ayer, 19:00', operator: 'C. Núñez' },
    ],
  },
]

const wait = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds))

export async function getAmbulances(): Promise<Ambulance[]> {
  await wait(350)
  return ambulances
}

export async function getAmbulanceById(id: string): Promise<Ambulance> {
  await wait(250)
  const ambulance = ambulances.find((item) => item.id === id)
  if (!ambulance) throw new Error('Ambulancia no encontrada')
  return ambulance
}