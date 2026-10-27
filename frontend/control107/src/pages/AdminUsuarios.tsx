import { useUsuarios } from "../hooks/useUsuarios";

export default function AdminUsuarios() {
    const {
        data: usuarios,
        isLoading,
        isError,
        error,
    } = useUsuarios();

    if (isLoading) {
        return (
            <section>
                <p className="text-petro/60">
                    Cargando usuarios...
                </p>
            </section>
        );
    }

    if (isError) {
        return (
            <section className="rounded-xl border border-coral/30 bg-coral/5 p-6">
                <p className="font-semibold text-coral">
                    No se pudieron cargar los usuarios.
                </p>

                <p className="mt-1 text-sm text-petro/60">
                    {error.message}
                </p>
            </section>
        );
    }

    return (
        <section className="text-petro">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">
                    Usuarios
                </h1>

                <p className="mt-2 text-sm text-petro/60">
                    Usuarios registrados en Control107.
                </p>
            </div>

            <div className="rounded-xl bg-blanco p-6 shadow-sm">
                {!usuarios || usuarios.length === 0 ? (
                    <p className="text-sm text-petro/60">
                        No hay usuarios registrados.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-petro/10 text-sm text-petro/60">
                                    <th className="px-3 py-3 font-semibold">
                                        Nombre
                                    </th>

                                    <th className="px-3 py-3 font-semibold">
                                        DNI
                                    </th>

                                    <th className="px-3 py-3 font-semibold">
                                        Email
                                    </th>

                                    <th className="px-3 py-3 font-semibold">
                                        Rol
                                    </th>

                                    <th className="px-3 py-3 font-semibold">
                                        Estado
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {usuarios.map((usuario) => (
                                    <tr
                                        key={usuario.id}
                                        className="border-b border-petro/10 last:border-b-0"
                                    >
                                        <td className="px-3 py-4 font-medium">
                                            {usuario.nombre}
                                        </td>

                                        <td className="px-3 py-4 text-sm">
                                            {usuario.dni}
                                        </td>

                                        <td className="px-3 py-4 text-sm">
                                            {usuario.email}
                                        </td>

                                        <td className="px-3 py-4">
                                            <span className="rounded-md bg-azul/10 px-2 py-1 text-xs font-semibold text-azul">
                                                {usuario.rol}
                                            </span>
                                        </td>

                                        <td className="px-3 py-4">
                                            <span
                                                className={
                                                    usuario.activo
                                                        ? "rounded-md bg-verde/10 px-2 py-1 text-xs font-semibold text-verde"
                                                        : "rounded-md bg-coral/10 px-2 py-1 text-xs font-semibold text-coral"
                                                }
                                            >
                                                {usuario.activo
                                                    ? "Activo"
                                                    : "Inactivo"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </section>
    );
}