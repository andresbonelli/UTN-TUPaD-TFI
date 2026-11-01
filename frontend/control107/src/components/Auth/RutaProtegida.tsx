import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuthStore } from "../../stores/authStore";

interface RutaProtegidaProps {
    children: ReactNode;
}

export default function RutaProtegida({
    children,
}: RutaProtegidaProps) {
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

    return children;
}