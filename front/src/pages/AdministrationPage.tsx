/**
 * Pantalla Principal del Sistema (Panel de Inicio de Operación).
 * Muestra el saludo personalizado, el rol activo, el resumen de guardia
 * y el botón de acceso o consulta de la Planilla de Control de Ingreso/Egreso.
 */

import { useEffect, useState } from 'react'
import { Activity, ArrowRight, CheckCircle2, ClipboardCheck, Eye, LogOut, ShieldCheck, Truck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { useAuth } from '../features/auth/useAuth'
import { getTurnoGuardiaActivo } from '../services/controlGuardiaService'
import type { TurnoGuardiaInfo } from '../types/controlGuardia'
import styles from './AdministrationPage.module.css'

export function AdministrationPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  
  // Estado local para almacenar la información del turno activo y determinar si ya finalizó
  const [turno, setTurno] = useState<TurnoGuardiaInfo | null>(null)
  const roleLabel = user?.role === 'operativo' ? 'Personal operativo' : 'Usuario administrativo'

  // Consulta al cargar la pantalla el estado del turno asignado al usuario
  useEffect(() => {
    async function loadTurno() {
      const data = await getTurnoGuardiaActivo()
      setTurno(data)
    }
    loadTurno()
  }, [])

  // Evalúa si AMBOS controles (Ingreso y Egreso) fueron guardados para considerar la guardia finalizada
  const isShiftCompleted = Boolean(turno?.controlIngresoCompletado && turno?.controlEgresoCompletado)

  return (
    <AppLayout onSignOut={signOut}>
      {/* Sección 1: Cabecera con saludo e identificación del perfil de acceso */}
      <section className={styles.intro} aria-labelledby="page-title">
        <div>
          <p className="eyebrow">CENTRO OPERATIVO</p>
          <h1 id="page-title">Buen día, {user?.name}</h1>
          <p>Resumen de actividad y estado de guardia.</p>
        </div>
        <span className={styles.role}>
          <ShieldCheck size={16} aria-hidden="true" /> {roleLabel}
        </span>
      </section>

      {/* Sección 2: Tarjetas de estado general de la guardia y acción siguiente */}
      <section className={styles.statusGrid} aria-label="Estado del sistema">
        <article>
          <Activity aria-hidden="true" />
          <span>Estado de Guardia</span>
          <strong>
            {isShiftCompleted
              ? 'Guardia Finalizada'
              : turno?.controlIngresoCompletado
              ? 'En Curso (Ingresado)'
              : 'Pendiente de Ingreso'}
          </strong>
        </article>
        <article>
          <ClipboardCheck aria-hidden="true" />
          <span>Próxima Acción</span>
          <strong>
            {isShiftCompleted
              ? 'Cerrar Sesión'
              : turno?.controlIngresoCompletado
              ? 'Realizar Egreso'
              : 'Realizar Ingreso'}
          </strong>
        </article>
      </section>

      {/* Sección 3: Banner interactivo para iniciar la planilla o consultar el registro firmado */}
      <div className={styles.controlBanner}>
        <div className={styles.controlBannerLeft}>
          <div className={styles.controlIcon} style={{ background: isShiftCompleted ? '#059669' : '#2563eb' }}>
            <Truck size={24} color="#ffffff" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
              {isShiftCompleted
                ? `Guardia Concluida - ${turno?.ambulancia.nroMovil}`
                : `Control de Guardia - ${turno?.ambulancia.nroMovil}`}
            </h3>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.875rem' }}>
              {isShiftCompleted
                ? 'Completaste el ingreso y el egreso. Tu registro ha sido firmado e inmovilizado.'
                : turno?.controlIngresoCompletado
                ? 'Ingreso registrado. Cuando concluya la jornada, completá la entrega (Egreso).'
                : 'Registrá la recepción de tu unidad y el inventario de insumos para iniciar.'}
            </p>
          </div>
        </div>

        {/* Acciones del banner: botón de planilla y botón directo de cierre de sesión al finalizar */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            className={styles.controlButton}
            style={{ background: isShiftCompleted ? '#475569' : '#2563eb' }}
            onClick={() => navigate('/control-ingreso')}
          >
            {isShiftCompleted ? (
              <>
                <Eye size={16} /> Ver Planilla Registrada (Solo Lectura)
              </>
            ) : (
              <>
                Iniciar Control <ArrowRight size={16} />
              </>
            )}
          </button>

          {isShiftCompleted && (
            <button className={styles.logoutButton} onClick={signOut}>
              <LogOut size={16} /> Cerrar Sesión
            </button>
          )}
        </div>
      </div>

      {/* Sección 4: Mensaje aclaratorio cuando la guardia ha sido completamente finalizada e inmovilizada */}
      {isShiftCompleted && (
        <div className={styles.closedBanner}>
          <CheckCircle2 size={20} color="#16a34a" />
          <span>
            <strong>Guardia cerrada:</strong> Completaste la entrega de tu unidad. La planilla de ingreso y egreso está inmutable. Tu única acción pendiente es cerrar la sesión.
          </span>
        </div>
      )}
    </AppLayout>
  )
}