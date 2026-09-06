import { createContext, useState, type PropsWithChildren } from 'react'
import type { SessionUser, UserRole } from '../../types/auth'

interface AuthContextValue {
  user: SessionUser | null
  signIn: (name: string, role: UserRole) => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<SessionUser | null>(null)

  function signIn(name: string, role: UserRole) {
    setUser({ id: 'demo-user', name, role })
  }

  function signOut() {
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, signIn, signOut }}>{children}</AuthContext.Provider>
}

export { AuthContext }