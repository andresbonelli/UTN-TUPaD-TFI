import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../features/auth/useAuth'
import type { UserRole } from '../types/auth'
import styles from './LoginPage.module.css'

// Defino las reglas mínimas del acceso para evitar avanzar con datos incompletos.
const loginSchema = z.object({
  name: z.string().trim().min(2, 'Ingresá tu nombre'),
  role: z.enum(['administrativo', 'operativo']),
})

type LoginForm = z.infer<typeof loginSchema>

export function LoginPage() {
  // Preparo el formulario con validación declarativa y dejo administrativo como perfil inicial.
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { role: 'administrativo' },
  })

  // Simulo el ingreso local, creo la sesión en memoria y llevo al usuario a su pantalla principal.
  function onSubmit(data: LoginForm) {
    signIn(data.name, data.role as UserRole)
    navigate('/administracion', { replace: true })
  }

  return (
    <main className={styles.page}>
      {/* Presento la identidad y el propósito del sistema en superficies amplias; en móvil este panel se oculta. */}
      <section className={styles.brandPanel} aria-labelledby="brand-title">
        <div className={styles.brandLockup}><span>107</span><strong>Control</strong></div>
        <div className={styles.brandCopy}>
          <p className="eyebrow">CENTRO OPERATIVO</p>
          <h1 id="brand-title">Orden para responder a tiempo.</h1>
          <p>Gestión y trazabilidad para turnos, ambulancias y controles del servicio de emergencias.</p>
        </div>
        <div className={styles.securityNote}><ShieldCheck size={18} aria-hidden="true" /><span>Acceso interno del servicio</span></div>
      </section>

      {/* Concentro el acceso en pocos campos y mantengo los controles grandes para uso táctil. */}
      <section className={styles.formPanel} aria-labelledby="login-title">
        <div className={styles.formHeader}>
          <p className="eyebrow">INGRESO AL SISTEMA</p>
          <h2 id="login-title">Bienvenido</h2>
          <p>Completá tus datos para ingresar a 107 Control.</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <label htmlFor="name">Nombre y apellido</label>
          <input id="name" type="text" autoComplete="name" placeholder="Ej. Hugo Catalan" {...register('name')} />
          {errors.name && <span className={styles.error}>{errors.name.message}</span>}

          <label htmlFor="role">Perfil de acceso</label>
          <select id="role" {...register('role')}>
            <option value="administrativo">Administrativo</option>
            <option value="operativo">Operativo</option>
          </select>
          {errors.role && <span className={styles.error}>{errors.role.message}</span>}

          <button type="submit" disabled={isSubmitting}>Ingresar <ArrowRight size={18} aria-hidden="true" /></button>
        </form>
        <p className={styles.demoNote}>Modo de demostración: el acceso se simula localmente y no guarda contraseñas.</p>
      </section>
    </main>
  )
}