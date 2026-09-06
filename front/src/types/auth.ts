export type UserRole = 'administrativo' | 'operativo'

export interface SessionUser {
  id: string
  name: string
  role: UserRole
}