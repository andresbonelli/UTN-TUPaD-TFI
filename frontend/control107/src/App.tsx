import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { useAuthStore } from "./stores/authStore";

import RutaPorRol from "./components/Auth/RutaPorRol";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCategorias from "./pages/AdminCategorias";
import OperativoEnfermero from "./pages/OperativoEnfermero";
import type { RolUsuario } from "./interfaces/Usuario";

function obtenerRutaInicial(rol: RolUsuario): string {
    if (rol === "ENFERMERO") {
        return "/operativo";
    }

    if (rol === "ADMINISTRADOR") {
        return "/admin";
    }

    return "/login";
}

function App() {
  const usuario = useAuthStore((state) => state.usuario);

  const restaurarSesion = useAuthStore((state) => state.restaurarSesion);

  useEffect(() => {
    restaurarSesion();
  }, [restaurarSesion]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          !usuario ? (<Navigate to="/login" replace />) : (
            <Navigate to={obtenerRutaInicial(usuario.rol)} replace />
          )
        }
      />

      <Route
        path="/admin"
        element={
          <RutaPorRol rolesPermitidos={["ADMINISTRADOR"]}>
            <AdminDashboard />
          </RutaPorRol>
        }
      />

      <Route
        path="/categorias"
        element={
          <RutaPorRol rolesPermitidos={["ADMINISTRADOR"]}>
            <AdminCategorias />
          </RutaPorRol>
        }
      />

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
