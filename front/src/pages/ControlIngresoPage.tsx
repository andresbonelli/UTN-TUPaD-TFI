/**
 * Componente Vista de Control de Guardia (Ingreso y Egreso de Ambulancia).
 * 
 * Reglas de Negocio Implementadas:
 * 1. Control de Ingreso (Recepción): Permite verificar el estado e insumos recibidos al iniciar el turno.
 * 2. Bloqueo de Egreso: La pestaña de Control de Egreso permanece deshabilitada hasta guardar el Ingreso.
 * 3. Control de Egreso (Entrega): Al guardar el Ingreso, se habilita el Egreso para modificar las cantidades dejadas.
 * 4. Modal de Confirmación e Inmutabilidad: Antes de guardar cualquier registro, se solicita confirmación explícita
 *    advirtiendo que el registro quedará firmado digitalmente y no podrá ser modificado.
 * 5. Cierre e Inmutabilidad Final: Únicamente cuando AMBOS controles (Ingreso y Egreso) se han guardado,
 *    la guardia se marca como Finalizada y la planilla pasa a modo Solo Lectura.
 */

import { useEffect, useState } from 'react'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Eye,
  Filter,
  Layers,
  Lock,
  LogOut,
  RotateCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Truck,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { useAuth } from '../features/auth/useAuth'
import {
  getInsumosChecklist,
  getTurnoGuardiaActivo,
  registrarControlEgreso,
  registrarControlIngreso,
  resetMockTurnoStatus,
} from '../services/controlGuardiaService'
import type {
  DetalleStockEgreso,
  DetalleStockIngreso,
  Insumo,
  TurnoGuardiaInfo,
} from '../types/controlGuardia'
import styles from './ControlIngresoPage.module.css'

export function ControlIngresoPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  // --------------------------------------------------------------------------
  // ESTADOS LOCALES DE LA VISTA
  // --------------------------------------------------------------------------
  const [mode, setMode] = useState<'INGRESO' | 'EGRESO'>('INGRESO') // Modo de la planilla activa (Ingreso/Egreso)
  const [step, setStep] = useState<1 | 2 | 3>(1) // Paso del formulario (1: Conteo, 2: Resumen, 3: Éxito)
  const [turnoActivo, setTurnoActivo] = useState<TurnoGuardiaInfo | null>(null) // Información del turno y móvil asignado
  const [insumos, setInsumos] = useState<Insumo[]>([]) // Catálogo de los 138 insumos médicos a controlar
  const [detallesStock, setDetallesStock] = useState<Record<number, number>>({}) // Cantidades contadas por ID de insumo
  const [observaciones, setObservaciones] = useState<string>('') // Notas generales introducidas por el enfermero
  const [searchTerm, setSearchTerm] = useState<string>('') // Término de búsqueda rápida por texto en tiempo real
  const [selectedCategory, setSelectedCategory] = useState<string>('TODAS') // Filtro activo de categoría seleccionada
  const [loading, setLoading] = useState<boolean>(true) // Estado de carga inicial
  const [submitting, setSubmitting] = useState<boolean>(false) // Estado durante el envío al backend
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false) // Control de visibilidad del modal flotante
  const [resultMessage, setResultMessage] = useState<string>('') // Mensaje de respuesta del servidor

  // Carga inicial de datos al montar la página
  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const [turno, insList] = await Promise.all([getTurnoGuardiaActivo(), getInsumosChecklist()])
      setTurnoActivo(turno)
      setInsumos(insList)

      // Si el usuario ya completó el ingreso previamente, se lo posiciona directamente en el Egreso editable
      if (turno.controlIngresoCompletado && !turno.controlEgresoCompletado) {
        setMode('EGRESO')
      } else {
        setMode('INGRESO')
      }

      // Inicializar el conteo de insumos con las cantidades base esperadas
      const initialStock: Record<number, number> = {}
      insList.forEach((ins) => {
        initialStock[ins.id] = ins.puntoDeControl
      })
      setDetallesStock(initialStock)
      setLoading(false)
    }
    loadData()
  }, [])

  // Handler para incrementar o decrementar la cantidad de un insumo evitando números negativos
  const handleStockChange = (insumoId: number, delta: number) => {
    setDetallesStock((prev) => {
      const current = prev[insumoId] ?? 0
      const next = Math.max(0, current + delta)
      return { ...prev, [insumoId]: next }
    })
  }

  // Handler de acción masiva para autocompletar todas las cantidades de un grupo de insumos al stock esperado (Línea Base)
  const handleMarkCategoryComplete = (catNombre: string) => {
    setDetallesStock((prev) => {
      const next = { ...prev }
      insumos.forEach((ins) => {
        if (ins.categoria === catNombre) {
          next[ins.id] = ins.puntoDeControl
        }
      })
      return next
    })
  }

  // Obtiene la clase CSS para el botón de filtrado con su color preestablecido oficial
  const getCategoryFilterBtnClass = (cat: string, isActive: boolean) => {
    switch (cat) {
      case 'Farmacológicos':
        return `${styles.categoryFilterBtn} ${styles.filterBtnFarmacologicos} ${isActive ? styles.filterBtnFarmacologicosActive : ''}`
      case 'Gotas y comprimidos':
        return `${styles.categoryFilterBtn} ${styles.filterBtnGotasComprimidos} ${isActive ? styles.filterBtnGotasComprimidosActive : ''}`
      case 'Descartables - Curaciones':
        return `${styles.categoryFilterBtn} ${styles.filterBtnDescartablesCuraciones} ${isActive ? styles.filterBtnDescartablesCuracionesActive : ''}`
      case 'Vía aérea':
        return `${styles.categoryFilterBtn} ${styles.filterBtnViaAerea} ${isActive ? styles.filterBtnViaAereaActive : ''}`
      case 'Descartables':
        return `${styles.categoryFilterBtn} ${styles.filterBtnDescartables} ${isActive ? styles.filterBtnDescartablesActive : ''}`
      case 'Equipamientos varios':
        return `${styles.categoryFilterBtn} ${styles.filterBtnEquipamientosVarios} ${isActive ? styles.filterBtnEquipamientosVariosActive : ''}`
      default:
        return `${styles.categoryFilterBtn} ${isActive ? styles.categoryFilterBtnActive : ''}`
    }
  }

  // Handler utilitario para reiniciar la prueba en modo demostración
  const handleResetDemo = () => {
    const reset = resetMockTurnoStatus()
    setTurnoActivo(reset)
    setMode('INGRESO')
    setStep(1)
    setObservaciones('')
    const initialStock: Record<number, number> = {}
    insumos.forEach((ins) => {
      initialStock[ins.id] = ins.puntoDeControl
    })
    setDetallesStock(initialStock)
  }

  // Ejecución final del guardado tras confirmar en el modal flotante
  const executeSave = async () => {
    if (!turnoActivo) return
    setShowConfirmModal(false)
    setSubmitting(true)

    if (mode === 'INGRESO') {
      // Preparar payload de Control de Ingreso
      const detalles: DetalleStockIngreso[] = insumos.map((ins) => ({
        insumoId: ins.id,
        insumoNombre: ins.nombre,
        cantidadEsperada: ins.puntoDeControl,
        cantidadRecibida: detallesStock[ins.id] ?? ins.puntoDeControl,
      }))

      const res = await registrarControlIngreso({
        turnoGuardiaId: turnoActivo.id,
        ambulanciaId: turnoActivo.ambulancia.id,
        enfermeroNombre: user?.name ?? 'Enfermero de Guardia',
        observacionesGenerales: observaciones,
        detalles,
      })

      setTurnoActivo((prev) => (prev ? { ...prev, controlIngresoCompletado: true } : prev))
      setSubmitting(false)
      setResultMessage(res.message)
      setStep(3)
    } else {
      // Preparar payload de Control de Egreso
      const detalles: DetalleStockEgreso[] = insumos.map((ins) => ({
        insumoId: ins.id,
        insumoNombre: ins.nombre,
        cantidadDejada: detallesStock[ins.id] ?? ins.puntoDeControl,
      }))

      const res = await registrarControlEgreso({
        turnoGuardiaId: turnoActivo.id,
        ambulanciaId: turnoActivo.ambulancia.id,
        enfermeroNombre: user?.name ?? 'Enfermero de Guardia',
        observacionesFinales: observaciones,
        detalles,
      })

      setTurnoActivo((prev) =>
        prev ? { ...prev, controlEgresoCompletado: true, estado: 'FINALIZADO' } : prev
      )
      setSubmitting(false)
      setResultMessage(res.message)
      setStep(3)
    }
  }

  // Conteo de diferencias encontradas entre el conteo ingresado y el valor esperado por el backend
  const discrepanciasCount = insumos.filter(
    (ins) => (detallesStock[ins.id] ?? ins.puntoDeControl) !== ins.puntoDeControl
  ).length

  // Variables de control de reglas de negocio
  const isIngresoDone = turnoActivo?.controlIngresoCompletado ?? false
  const isEgresoDone = turnoActivo?.controlEgresoCompletado ?? false
  const isBothCompleted = isIngresoDone && isEgresoDone

  // Determina si el modo actual está abierto a modificaciones o inmutabilizado
  const isCurrentModeEditable =
    mode === 'INGRESO' ? !isIngresoDone : mode === 'EGRESO' ? isIngresoDone && !isEgresoDone : false

  // Obtiene la clase CSS para el encabezado de categoría según la paleta de colores oficial
  const getCategoryHeaderClass = (cat: string) => {
    switch (cat) {
      case 'Farmacológicos':
        return styles.catFarmacologicos
      case 'Gotas y comprimidos':
        return styles.catGotasComprimidos
      case 'Descartables - Curaciones':
        return styles.catDescartablesCuraciones
      case 'Vía aérea':
        return styles.catViaAerea
      case 'Descartables':
        return styles.catDescartables
      case 'Equipamientos varios':
        return styles.catEquipamientosVarios
      default:
        return styles.catEquipamientosVarios
    }
  }

  // Obtiene la clase CSS de la insignia táctica individual para la categoría
  const getCategoryBadgeClass = (cat: string) => {
    switch (cat) {
      case 'Farmacológicos':
        return styles.badgeCatFarmacologicos
      case 'Gotas y comprimidos':
        return styles.badgeCatGotasComprimidos
      case 'Descartables - Curaciones':
        return styles.badgeCatDescartablesCuraciones
      case 'Vía aérea':
        return styles.badgeCatViaAerea
      case 'Descartables':
        return styles.badgeCatDescartables
      case 'Equipamientos varios':
        return styles.badgeCatEquipamientosVarios
      default:
        return styles.badgeCatEquipamientosVarios
    }
  }

  // Lista ordenada de categorías oficiales de la planilla de guardia 107
  const categoriasOficiales = [
    'Farmacológicos',
    'Gotas y comprimidos',
    'Descartables - Curaciones',
    'Vía aérea',
    'Descartables',
    'Equipamientos varios',
  ]

  // Insumos filtrados por término de búsqueda y por categoría activa
  const insumosFiltrados = insumos.filter((ins) => {
    const matchSearch = ins.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCat = selectedCategory === 'TODAS' || ins.categoria === selectedCategory
    return matchSearch && matchCat
  })

  // Agrupamiento por categorías activas para su renderizado por bloques cromáticos
  const insumosAgrupados = categoriasOficiales.reduce<Record<string, Insumo[]>>((acc, cat) => {
    const items = insumosFiltrados.filter((i) => i.categoria === cat)
    if (items.length > 0) {
      acc[cat] = items
    }
    return acc
  }, {})

  return (
    <AppLayout onSignOut={signOut}>
      <div className={styles.page}>
        {/* Cabecera del módulo con título y botón de reinicio demo */}
        <header className={styles.header}>
          <div className={styles.headerTitle}>
            <h1>Control de Guardia - Stock e Inventario</h1>
            <p>Registro de recepción (Ingreso) y entrega (Egreso) de la unidad asignada al turno.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button className={styles.btnResetDemo} onClick={handleResetDemo}>
              <RotateCcw size={14} /> Reiniciar Prueba
            </button>
            <div className={styles.userBadge}>
              <ShieldAlert size={16} /> Personal: {user?.name}
            </div>
          </div>
        </header>

        {/* Pestañas de Selección de Modo (Ingreso vs Egreso) */}
        <div className={styles.modeToggle}>
          <button
            type="button"
            className={`${styles.modeTab} ${mode === 'INGRESO' ? styles.modeTabActiveIngreso : ''}`}
            onClick={() => {
              setMode('INGRESO')
              setStep(1)
            }}
          >
            <ClipboardCheck size={16} /> Control de Ingreso {isIngresoDone ? '✓ (Guardado)' : ''}
          </button>

          <button
            type="button"
            className={`${styles.modeTab} ${mode === 'EGRESO' ? styles.modeTabActiveEgreso : ''} ${!isIngresoDone ? styles.modeTabDisabled : ''}`}
            disabled={!isIngresoDone}
            title={!isIngresoDone ? 'Debes completar primero el Control de Ingreso' : ''}
            onClick={() => {
              if (isIngresoDone) {
                setMode('EGRESO')
                setStep(1)
              }
            }}
          >
            {!isIngresoDone ? <Lock size={16} /> : <LogOut size={16} />} Control de Egreso{' '}
            {!isIngresoDone ? '(Requiere Ingreso)' : isEgresoDone ? '✓ (Guardado)' : '🔓 (Habilitado)'}
          </button>
        </div>

        {/* Mensajes informativos de reglas de negocio */}
        {!isIngresoDone && (
          <div className={styles.lockedNotice}>
            <Lock size={18} />
            <span>
              <strong>Paso 1:</strong> Realizá y guardá primero el <strong>Control de Ingreso</strong>. Una vez guardado, se desbloqueará automáticamente el Control de Egreso para cuando concluyas tu turno.
            </span>
          </div>
        )}

        {isIngresoDone && !isEgresoDone && mode === 'INGRESO' && (
          <div className={styles.lockedNoticeSuccess}>
            <ShieldCheck size={20} />
            <span>
              <strong>Ingreso Registrado:</strong> Completaste la recepción del turno. Hacé clic en la pestaña <strong>Control de Egreso</strong> cuando vayas a entregar la unidad al finalizar la jornada.
            </span>
          </div>
        )}

        {isBothCompleted && (
          <div className={styles.lockedNoticeSuccess}>
            <ShieldCheck size={20} />
            <span>
              <strong>Guardia Finalizada (Inmutable):</strong> Ambos registros (Ingreso y Egreso) fueron guardados y firmados digitalmente. Los datos se muestran en modo Solo Lectura.
            </span>
          </div>
        )}

        {/* Tarjeta de la Ambulancia asignada al turno activo */}
        {turnoActivo && (
          <div className={styles.assignedUnitBanner}>
            <div className={styles.assignedUnitInfo}>
              <div className={styles.assignedIcon}>
                <Truck size={24} color="#ffffff" />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Ambulancia Asignada a tu Turno
                </span>
                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{turnoActivo.ambulancia.nroMovil}</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1' }}>
                  Patente: <strong>{turnoActivo.ambulancia.patente}</strong> | {turnoActivo.ambulancia.marcaModelo} (Horario: {turnoActivo.horaInicio} - {turnoActivo.horaFin})
                </p>
              </div>
            </div>
            <span style={{ background: '#dcfce7', color: '#166534', fontWeight: 700, padding: '0.3rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem' }}>
              UNIDAD APTA
            </span>
          </div>
        )}

        {/* PASO 1: Tabla e Inventario Completo de 138 Insumos Agrupados por Colores */}
        {step === 1 && (
          <section className={styles.sectionCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 className={styles.sectionTitle}>
                  <ClipboardList size={20} color={mode === 'INGRESO' ? '#2563eb' : '#059669'} />
                  {mode === 'INGRESO' ? 'Planilla de Control de Ingreso (138 Insumos)' : 'Planilla de Control de Egreso (138 Insumos)'}{' '}
                  {!isCurrentModeEditable && '(Solo Lectura / Firmado)'}
                </h2>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
                  {mode === 'INGRESO'
                    ? 'Verificá y declará las cantidades recibidas de los 138 insumos oficiales divididos por colores.'
                    : 'Declará las cantidades finales dejadas en la unidad al concluir la guardia.'}
                </p>
              </div>

              {/* Insignia con el estado del conteo total */}
              <div style={{ background: '#f1f5f9', padding: '0.5rem 1rem', borderRadius: '10px', display: 'flex', gap: '1rem', fontSize: '0.85rem', fontWeight: 600 }}>
                <span>📦 Total Insumos: <strong>{insumos.length}</strong></span>
                <span style={{ color: discrepanciasCount > 0 ? '#dc2626' : '#16a34a' }}>
                  ⚠️ Discrepancias: <strong>{discrepanciasCount}</strong>
                </span>
              </div>
            </div>

            {/* Barra de herramientas: Buscador y Filtros por Categoría */}
            <div className={styles.toolbar}>
              <div className={styles.searchContainer}>
                <Search className={styles.searchIcon} size={18} />
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="Buscar insumo por nombre (ej. Adrenalina, Cánula, Guantes, Oxígeno...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Botones de filtrado por categoría cromática oficial */}
              <div className={styles.categoryFilterList}>
                <button
                  type="button"
                  className={`${styles.categoryFilterBtn} ${selectedCategory === 'TODAS' ? styles.categoryFilterBtnActive : ''}`}
                  onClick={() => setSelectedCategory('TODAS')}
                >
                  <Layers size={14} /> Todas ({insumos.length})
                </button>
                {categoriasOficiales.map((cat) => {
                  const count = insumos.filter((i) => i.categoria === cat).length
                  const isActive = selectedCategory === cat
                  return (
                    <button
                      key={cat}
                      type="button"
                      className={getCategoryFilterBtnClass(cat, isActive)}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      <Filter size={12} /> {cat} ({count})
                    </button>
                  )
                })}
              </div>
            </div>

            {loading ? (
              <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>Cargando catálogo completo de insumos...</p>
            ) : Object.keys(insumosAgrupados).length === 0 ? (
              <div style={{ textAlign: 'center', color: '#64748b', padding: '2.5rem', background: '#f8fafc', borderRadius: '12px' }}>
                <Search size={32} style={{ color: '#94a3b8', marginBottom: '0.5rem' }} />
                <p style={{ margin: 0, fontWeight: 600 }}>No se encontraron insumos coincidentes con "{searchTerm}".</p>
                <button
                  type="button"
                  style={{ marginTop: '0.75rem', background: 'none', border: 'none', color: '#2563eb', fontWeight: 700, cursor: 'pointer' }}
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('TODAS')
                  }}
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              /* Renderizado jerárquico por secciones de categorías con distinción cromática */
              Object.entries(insumosAgrupados).map(([catNombre, itemsList]) => {
                // Comprobación de si todos los ítems de esta categoría están en su stock base esperado
                const isCategoryVerified = itemsList.every(
                  (ins) => (detallesStock[ins.id] ?? ins.puntoDeControl) === ins.puntoDeControl
                )

                return (
                  <div key={catNombre} className={`${styles.categoryGroupSection}`}>
                    {/* Encabezado de la categoría con su color distintivo y botón de acción masiva */}
                    <div className={`${styles.categoryHeader} ${getCategoryHeaderClass(catNombre)}`}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span>Categoría: {catNombre} ({itemsList.length} ítems)</span>
                        {isCategoryVerified ? (
                          <span className={styles.badgeCategoryVerified}>
                            <CheckCircle2 size={13} /> Grupo Completo / OK
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.75rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Con novedades
                          </span>
                        )}
                      </div>

                      {/* Botón táctico para autocompletar todas las cantidades esperadas de la categoría */}
                      <button
                        type="button"
                        className={styles.btnCategoryComplete}
                        disabled={!isCurrentModeEditable}
                        title="Establecer automáticamente las cantidades esperadas para todo este grupo"
                        onClick={() => handleMarkCategoryComplete(catNombre)}
                      >
                        <Check size={14} /> Marcar Grupo Completo
                      </button>
                    </div>

                    <table className={styles.insumosTable}>
                      <thead>
                        <tr>
                          <th>Insumo / Elemento</th>
                          <th>Etiqueta</th>
                          <th>Punto de Control (Línea Base)</th>
                          <th>{mode === 'INGRESO' ? 'Cantidad Recibida' : 'Cantidad Dejada'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {itemsList.map((ins) => {
                          const actual = detallesStock[ins.id] ?? ins.puntoDeControl
                          const tieneDiferencia = actual !== ins.puntoDeControl
                          return (
                            <tr key={ins.id}>
                              <td>
                                <div className={styles.insumoName}>
                                  {ins.nombre}
                                  {ins.esCritico && <span className={styles.badgeCritico}>CRÍTICO</span>}
                                </div>
                                {tieneDiferencia && (
                                  <div className={styles.discrepanciaWarning}>
                                    <AlertTriangle size={14} /> Diferencia: {actual - ins.puntoDeControl > 0 ? `+${actual - ins.puntoDeControl}` : actual - ins.puntoDeControl} unidad(es)
                                  </div>
                                )}
                              </td>
                              <td>
                                <span className={`${styles.categoryFilterBtn} ${getCategoryBadgeClass(ins.categoria)}`}>
                                  {ins.categoria}
                                </span>
                              </td>
                              <td style={{ fontWeight: 700, fontSize: '1.05rem', color: '#334155' }}>
                                {ins.puntoDeControl === 0 ? '--- (Opcional)' : ins.puntoDeControl}
                              </td>
                              <td>
                                <div className={styles.counterInput}>
                                  <button
                                    type="button"
                                    className={styles.counterBtn}
                                    disabled={!isCurrentModeEditable}
                                    onClick={() => handleStockChange(ins.id, -1)}
                                  >
                                    -
                                  </button>
                                  <input
                                    type="text"
                                    readOnly
                                    value={actual}
                                    className={styles.counterValue}
                                    style={{ borderColor: tieneDiferencia ? '#dc2626' : '#cbd5e1' }}
                                  />
                                  <button
                                    type="button"
                                    className={styles.counterBtn}
                                    disabled={!isCurrentModeEditable}
                                    onClick={() => handleStockChange(ins.id, 1)}
                                  >
                                    +
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )
              })
            )}

            {discrepanciasCount > 0 && isCurrentModeEditable && (
              <div style={{ background: '#fff7ed', border: '1px solid #ffedd5', padding: '1rem', borderRadius: '10px', color: '#c2410c', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <AlertTriangle size={20} />
                <span>
                  <strong>Atención:</strong> Registraste {discrepanciasCount} diferencia(s) de stock en la unidad. Se notificará al sistema de auditoría.
                </span>
              </div>
            )}

            <div className={styles.actionsBar}>
              <button className={styles.btnSecondary} onClick={() => navigate('/administracion')}>
                Volver al Inicio
              </button>

              {!isCurrentModeEditable ? (
                <button className={styles.btnSecondary} onClick={() => navigate('/administracion')}>
                  <Eye size={18} /> Planilla Guardada (Volver al Inicio)
                </button>
              ) : (
                <button
                  className={mode === 'INGRESO' ? styles.btnPrimary : styles.btnPrimaryEgreso}
                  onClick={() => setStep(2)}
                >
                  Revisar y Confirmar <ArrowRight size={18} />
                </button>
              )}
            </div>
          </section>
        )}

        {/* PASO 2: Resumen y Observaciones antes de confirmación */}
        {step === 2 && (
          <section className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>
              <CheckCircle2 size={20} color={mode === 'INGRESO' ? '#2563eb' : '#059669'} />
              {mode === 'INGRESO' ? 'Confirmar Registro de Ingreso' : 'Confirmar Registro de Egreso'}
            </h2>

            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Unidad asignada:</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{turnoActivo?.ambulancia.nroMovil}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Enfermero actuante:</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{user?.name}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Tipo de control:</span>
                <div style={{ fontWeight: 700, color: mode === 'INGRESO' ? '#2563eb' : '#059669' }}>
                  {mode === 'INGRESO' ? 'Check-in (Recepción de Unidad)' : 'Check-out (Entrega de Unidad)'}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Estado de discrepancias:</span>
                <div style={{ fontWeight: 700, color: discrepanciasCount > 0 ? '#dc2626' : '#16a34a' }}>
                  {discrepanciasCount > 0 ? `${discrepanciasCount} insumo(s) con diferencia` : 'Sin discrepancias'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="obs" style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                Observaciones {mode === 'INGRESO' ? 'de recepción' : 'de entrega'} (Opcional):
              </label>
              <textarea
                id="obs"
                className={styles.textarea}
                disabled={!isCurrentModeEditable}
                placeholder={mode === 'INGRESO' ? 'Ej. Se recibe el móvil limpio y con precinto...' : 'Ej. Se utilizó 1 tubo de oxígeno durante traslado de emergencia...'}
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
              />
            </div>

            <div className={styles.actionsBar}>
              <button className={styles.btnSecondary} onClick={() => setStep(1)}>
                <ArrowLeft size={18} /> Modificar Cantidades
              </button>
              <button
                className={mode === 'INGRESO' ? styles.btnPrimary : styles.btnPrimaryEgreso}
                disabled={submitting || !isCurrentModeEditable}
                onClick={() => setShowConfirmModal(true)}
              >
                {submitting ? 'Guardando...' : `Guardar Control de ${mode === 'INGRESO' ? 'Ingreso' : 'Egreso'}`} <Check size={18} />
              </button>
            </div>
          </section>
        )}

        {/* PASO 3: Confirmación Exitosa */}
        {step === 3 && (
          <section className={`${styles.sectionCard} ${styles.successCard}`}>
            <div className={styles.successIcon}>
              <CheckCircle2 size={40} />
            </div>
            <h2 style={{ fontSize: '1.5rem', margin: 0, color: '#065f46' }}>
              ¡Control de {mode === 'INGRESO' ? 'Ingreso' : 'Egreso'} Registrado!
            </h2>
            <p style={{ color: '#4b5563', maxWidth: '520px', margin: 0 }}>
              {resultMessage}
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              {mode === 'INGRESO' ? (
                <button
                  className={styles.btnPrimaryEgreso}
                  onClick={() => {
                    setMode('EGRESO')
                    setStep(1)
                  }}
                >
                  Continuar al Control de Egreso (Entrega) <ArrowRight size={18} />
                </button>
              ) : (
                <button className={styles.btnPrimary} onClick={() => navigate('/administracion')}>
                  Volver al Inicio (Finalizar Guardia)
                </button>
              )}
            </div>
          </section>
        )}

        {/* MODAL FLOTANTE DE CONFIRMACIÓN DE FIRMA DIGITAL E INMUTABILIDAD */}
        {showConfirmModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <AlertTriangle size={28} color="#dc2626" />
                <h3>¿Confirmar registro de Control de {mode === 'INGRESO' ? 'Ingreso' : 'Egreso'}?</h3>
              </div>
              <div className={styles.modalBody}>
                <p style={{ margin: 0 }}>
                  Estás a punto de registrar oficialmente el control de la unidad <strong>{turnoActivo?.ambulancia.nroMovil}</strong>.
                </p>
              </div>
              <div className={styles.modalAlertBox}>
                <Lock size={18} />
                <span>
                  <strong>Importante:</strong> Una vez guardado{mode === 'EGRESO' ? ' el egreso, la guardia quedará finalizada e inmutable.' : ', se habilitará la pestaña de Egreso.'}
                </span>
              </div>
              <div className={styles.modalFooter}>
                <button className={styles.btnSecondary} onClick={() => setShowConfirmModal(false)}>
                  Cancelar / Revisar
                </button>
                <button
                  className={mode === 'INGRESO' ? styles.btnPrimary : styles.btnPrimaryEgreso}
                  onClick={executeSave}
                >
                  Sí, Confirmar y Guardar <Check size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
