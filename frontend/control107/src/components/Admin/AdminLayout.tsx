import { NavLink, Outlet } from "react-router-dom";

import BotonLogout from "../Auth/BotonLogout";
import { useAuthStore } from "../../stores/authStore";

export default function AdminLayout() {
    const usuario = useAuthStore((state) => state.usuario);

    return (
        <main className="min-h-screen bg-fondo text-petro">
            <header className="border-b border-petro/10 bg-blanco">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 p-6">
                    <div>
                        <h1 className="text-2xl font-bold text-petro">Control107</h1>

                        <p className="text-sm text-petro/60">Panel de administración</p>
                    </div>

                    <div className="flex items-center gap-4">
                        {usuario && (
                            <span className="hidden text-sm text-petro/60 sm:block">
                                {usuario.email}
                            </span>
                        )}

                        <BotonLogout />
                    </div>
                </div>
            </header>

            <div className="mx-auto grid max-w-7xl gap-6 p-6 lg:grid-cols-[220px_1fr]">
                <nav className="h-fit rounded-xl bg-blanco p-4 shadow-sm">
                    <p className="mb-3 text-xs font-semibold uppercase text-petro/50">
                        Administración
                    </p>

                    <div className="flex flex-col gap-2">
                        <NavLink
                            to="/admin"
                            end
                            className={({ isActive }) =>
                                isActive
                                    ? "rounded-lg bg-turquesa px-3 py-2 text-sm font-semibold text-blanco"
                                    : "rounded-lg px-3 py-2 text-sm font-medium text-petro transition hover:bg-petro/5"
                            }
                        >
                            Dashboard
                        </NavLink>

                        <NavLink
                            to="/admin/categorias"
                            className={({ isActive }) =>
                                isActive
                                    ? "rounded-lg bg-turquesa px-3 py-2 text-sm font-semibold text-blanco"
                                    : "rounded-lg px-3 py-2 text-sm font-medium text-petro transition hover:bg-petro/5"
                            }
                        >
                            Categorías
                        </NavLink>

                        <NavLink
                            to="/admin/insumos"
                            className={({ isActive }) =>
                                isActive
                                    ? "rounded-lg bg-turquesa px-3 py-2 text-sm font-semibold text-blanco"
                                    : "rounded-lg px-3 py-2 text-sm font-medium text-petro transition hover:bg-petro/5"
                            }
                        >
                            Insumos
                        </NavLink>

                        <NavLink
                            to="/admin/ambulancias"
                            className={({ isActive }) =>
                                isActive
                                    ? "rounded-lg bg-turquesa px-3 py-2 text-sm font-semibold text-blanco"
                                    : "rounded-lg px-3 py-2 text-sm font-medium text-petro transition hover:bg-petro/5"
                            }
                        >
                            Ambulancias
                        </NavLink>

                        <NavLink
                            to="/admin/usuarios"
                            className={({ isActive }) =>
                                isActive
                                    ? "rounded-lg bg-turquesa px-3 py-2 text-sm font-semibold text-blanco"
                                    : "rounded-lg px-3 py-2 text-sm font-medium text-petro transition hover:bg-petro/5"
                            }
                        >
                            Usuarios
                        </NavLink>

                        <NavLink
                            to="/admin/turnos"
                            className={({ isActive }) =>
                                isActive
                                    ? "rounded-lg bg-turquesa px-3 py-2 text-sm font-semibold text-blanco"
                                    : "rounded-lg px-3 py-2 text-sm font-medium text-petro transition hover:bg-petro/5"
                            }
                        >
                            Turnos
                        </NavLink>
                    </div>
                </nav>

                <section>
                    <Outlet />
                </section>
            </div>
        </main>
    );
}
