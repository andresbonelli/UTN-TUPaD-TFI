import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../features/auth/useAuth'
import { AdministrationPage } from '../pages/AdministrationPage'
import { LoginPage } from '../pages/LoginPage'

function ProtectedRoute() {
  // Compruebo la sesión antes de renderizar la pantalla principal y devuelvo al login si no existe.
  const { user } = useAuth()
  return user ? <AdministrationPage /> : <Navigate to="/login" replace />
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      {/* Mantengo solo el acceso público y la pantalla principal hasta completar los demás módulos. */}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/administracion" element={<ProtectedRoute />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}