import type { ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../features/auth/useAuth'
import { AdministrationPage } from '../pages/AdministrationPage'
import { ControlIngresoPage } from '../pages/ControlIngresoPage'
import { LoginPage } from '../pages/LoginPage'

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  return user ? <>{children}</> : <Navigate to="/login" replace />
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/administracion"
          element={
            <ProtectedRoute>
              <AdministrationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/control-ingreso"
          element={
            <ProtectedRoute>
              <ControlIngresoPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}