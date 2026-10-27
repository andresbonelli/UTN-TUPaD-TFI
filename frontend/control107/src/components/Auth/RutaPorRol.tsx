import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuthStore } from "../../stores/authStore";
import type { RolUsuario } from "../../interfaces/Usuario";

interface RutaPorRolProps {
    children: ReactNode;
    rolesPermitidos: RolUsuario[];
}

export default function RutaPorRol({
    children,
    rolesPermitidos,
}: RutaPorRolProps) {
    const usuario = useAuthStore(
        (state) => state.usuario
    );

    if (!usuario) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    if (!rolesPermitidos.includes(usuario.rol)) {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    return children;
}