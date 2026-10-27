import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { useAuthStore } from "./stores/authStore";
import { obtenerRutaInicial } from "./utils/auth";

import RutaPorRol from "./components/Auth/RutaPorRol";
import AdminLayout from "./components/Admin/AdminLayout";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCategorias from "./pages/AdminCategorias";
import OperativoEnfermero from "./pages/OperativoEnfermero";

function App() {
  const usuario = useAuthStore((state) => state.usuario);

  const sesionRestaurada = useAuthStore((state) => state.sesionRestaurada);

  const restaurarSesion = useAuthStore((state) => state.restaurarSesion);

  useEffect(() => {
    restaurarSesion();
  }, [restaurarSesion]);

  if (!sesionRestaurada) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-fondo text-petro">
        <p>Restaurando sesión...</p>
      </main>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          !usuario ? (
            <Navigate to="/login" replace />
          ) : (
            <Navigate to={obtenerRutaInicial(usuario.rol)} replace />
          )
        }
      />

      <Route
        path="/admin"
        element={
          <RutaPorRol rolesPermitidos={["ADMINISTRADOR"]}>
            <AdminLayout />
          </RutaPorRol>
        }
      >
        <Route index element={<AdminDashboard />} />

        <Route path="categorias" element={<AdminCategorias />} />
      </Route>

      <Route
        path="/operativo"
        element={
          <RutaPorRol rolesPermitidos={["ENFERMERO"]}>
            <OperativoEnfermero />
          </RutaPorRol>
        }
      />
    </Routes>
  );
}

export default App;
