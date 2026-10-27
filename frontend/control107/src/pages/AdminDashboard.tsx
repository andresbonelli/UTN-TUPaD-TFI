import { Link } from "react-router-dom";

export default function AdminDashboard() {
    return (
        <section>
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-petro">Dashboard</h2>

                <p className="mt-2 text-sm text-petro/60">
                    Gestiona los recursos principales de Control107.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <Link
                    to="/admin/categorias"
                    className="rounded-xl bg-blanco p-6 shadow-sm transition hover:shadow-md"
                >
                    <h3 className="text-lg font-semibold text-petro">Categorías</h3>

                    <p className="mt-2 text-sm text-petro/60">
                        Gestiona las categorías y sus colores.
                    </p>
                </Link>

                <Link
                    to="/admin/insumos"
                    className="rounded-xl bg-blanco p-6 shadow-sm transition hover:shadow-md"
                >
                    <h3 className="text-lg font-semibold text-petro">Insumos</h3>

                    <p className="mt-2 text-sm text-petro/60">
                        Consulta los insumos y sus puntos de control.
                    </p>
                </Link>

                <Link
                    to="/admin/ambulancias"
                    className="rounded-xl bg-blanco p-6 shadow-sm transition hover:shadow-md"
                >
                    <h3 className="text-lg font-semibold text-petro">Ambulancias</h3>

                    <p className="mt-2 text-sm text-petro/60">
                        Consulta las ambulancias registradas.
                    </p>
                </Link>

                <Link
                    to="/admin/usuarios"
                    className="rounded-xl bg-blanco p-6 shadow-sm transition hover:shadow-md"
                >
                    <h3 className="text-lg font-semibold text-petro">Usuarios</h3>

                    <p className="mt-2 text-sm text-petro/60">
                        Consulta los usuarios y roles registrados.
                    </p>
                </Link>

                <Link
                    to="/admin/turnos"
                    className="rounded-xl bg-blanco p-6 shadow-sm transition hover:shadow-md"
                >
                    <h3 className="text-lg font-semibold text-petro">Turnos</h3>

                    <p className="mt-2 text-sm text-petro/60">
                        Consulta los turnos registrados y su estado.
                    </p>
                </Link>
            </div>
        </section>
    );
}
