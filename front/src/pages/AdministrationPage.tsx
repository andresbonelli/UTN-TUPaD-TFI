import { Activity, ClipboardCheck, ShieldCheck } from 'lucide-react'
import { useAuth } from '../features/auth/useAuth'
import { AppLayout } from '../components/layout/AppLayout'
import styles from './AdministrationPage.module.css'

export function AdministrationPage() {
  // Tomo la sesión actual para personalizar el saludo y mostrar claramente el rol activo.
  const { user, signOut } = useAuth()
  const roleLabel = user?.role === 'operativo' ? 'Personal operativo' : 'Usuario administrativo'

  return (
    // Mantengo esta primera pantalla deliberadamente simple: sirve como destino verificable después del login.
    <AppLayout onSignOut={signOut}>
      {/* Muestro contexto de operación y permiso sin depender únicamente de un color. */}
      <section className={styles.intro} aria-labelledby="page-title">
        <div><p className="eyebrow">CENTRO OPERATIVO</p><h1 id="page-title">Buen día, {user?.name}</h1><p>Este es el resumen inicial de tu operación.</p></div>
        <span className={styles.role}><ShieldCheck size={16} aria-hidden="true" /> {roleLabel}</span>
      </section>
      {/* Resumo las dos señales iniciales que el usuario necesita leer al entrar al sistema. */}
      <section className={styles.statusGrid} aria-label="Estado del sistema">
        <article><Activity aria-hidden="true" /><span>Estado general</span><strong>Operativo</strong></article>
        <article><ClipboardCheck aria-hidden="true" /><span>Próximo paso</span><strong>Revisar turno</strong></article>
      </section>
      {/* Dejo visible el alcance actual para que la pantalla no prometa módulos aún no implementados. */}
      <div className={styles.notice}><strong>Tu espacio de trabajo está listo.</strong><span>Las funciones de turnos, ambulancias y stock se incorporarán en las próximas etapas.</span></div>
    </AppLayout>
  )
}