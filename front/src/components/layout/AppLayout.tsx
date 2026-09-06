import type { PropsWithChildren } from 'react'
import { Activity, LogOut } from 'lucide-react'
import styles from './AppLayout.module.css'

interface AppLayoutProps extends PropsWithChildren { onSignOut?: () => void }

export function AppLayout({ children, onSignOut }: AppLayoutProps) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <a className={styles.brand} href="/" aria-label="107 Control, inicio">
          <span className={styles.brandMark}>107</span>
          <span>Control</span>
        </a>
        <div className={styles.headerActions}>
          <div className={styles.environment}><Activity size={15} aria-hidden="true" /> Operaciones</div>
          {onSignOut && <button className={styles.signOut} type="button" onClick={onSignOut}><LogOut size={15} aria-hidden="true" /> Salir</button>}
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  )
}