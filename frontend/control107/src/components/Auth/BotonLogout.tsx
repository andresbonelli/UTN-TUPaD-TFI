import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../../stores/authStore";

export default function BotonLogout() {
    const navigate = useNavigate();

    const cerrarSesion = useAuthStore(
        (state) => state.cerrarSesion
    );

    function handleLogout() {
        cerrarSesion();

        navigate("/login", {
            replace: true,
        });
    }

    return (
        <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-coral/30 px-3 py-2 text-sm font-semibold text-coral transition hover:bg-coral/10"
        >
            Cerrar sesión
        </button>
    );
}