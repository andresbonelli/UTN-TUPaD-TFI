import { Link } from "react-router-dom";

export default function AdminDashboard() {
    return (
        <section>
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-petro">
                    Dashboard
                </h2>

                <p className="mt-2 text-sm text-petro/60">
                    Gestiona los recursos principales de Control107.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <Link to="/admin/categorias"
                    className="rounded-xl bg-blanco p-6 shadow-sm transition hover:shadow-md"
                >
                    <h3 className="text-lg font-semibold text-petro">
                        Categorías
                    </h3>

                    <p className="mt-2 text-sm text-petro/60">
                        Gestiona las categorías y sus colores.
                    </p>
                </Link>

                <div className="rounded-xl bg-blanco p-6 opacity-60 shadow-sm">
                    <h3 className="text-lg font-semibold text-petro">
                        Insumos
                    </h3>

                    <p className="mt-2 text-sm text-petro/60">
                        Gestión del catálogo de insumos.
                    </p>

                    <p className="mt-3 text-xs font-semibold text-ambar">
                        Próximamente
                    </p>
                </div>

                <div className="rounded-xl bg-blanco p-6 opacity-60 shadow-sm">
                    <h3 className="text-lg font-semibold text-petro">
                        Ambulancias
                    </h3>

                    <p className="mt-2 text-sm text-petro/60">
                        Gestión de las ambulancias.
                    </p>

                    <p className="mt-3 text-xs font-semibold text-ambar">
                        Próximamente
                    </p>
                </div>

                <Link
                    to="/admin/usuarios"
                    className="rounded-xl bg-blanco p-6 shadow-sm transition hover:shadow-md"
                >
                    <h3 className="text-lg font-semibold text-petro">
                        Usuarios
                    </h3>

                    <p className="mt-2 text-sm text-petro/60">
                        Consulta los usuarios y roles registrados.
                    </p>
                </Link>

                <div className="rounded-xl bg-blanco p-6 opacity-60 shadow-sm">
                    <h3 className="text-lg font-semibold text-petro">
                        Turnos
                    </h3>

                    <p className="mt-2 text-sm text-petro/60">
                        Gestión y asignación de turnos.
                    </p>

                    <p className="mt-3 text-xs font-semibold text-ambar">
                        Próximamente
                    </p>
                </div>
            </div>
        </section>
    );
}