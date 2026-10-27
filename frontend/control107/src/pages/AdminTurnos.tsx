import { useTurnos } from "../hooks/useTurnos";

import type {
    EstadoTurno,
    HorarioTurno,
} from "../interfaces/Turno";

function obtenerColorEstado(
    estado: EstadoTurno
): string {
    if (estado === "PROGRAMADO") {
        return "bg-azul/10 text-azul";
    }

    if (estado === "EN_CURSO") {
        return "bg-verde/10 text-verde";
    }

    if (estado === "CANCELADO") {
        return "bg-coral/10 text-coral";
    }

    return "bg-petro/10 text-petro";
}

function obtenerTextoEstado(
    estado: EstadoTurno
): string {
    if (estado === "PROGRAMADO") {
        return "Programado";
    }

    if (estado === "EN_CURSO") {
        return "En curso";
    }

    if (estado === "FINALIZADO") {
        return "Finalizado";
    }

    return "Cancelado";
}

function textoHorario(
    horario: HorarioTurno
): string {
    if (horario === "MANIANA") {
        return "Mañana";
    }

    if (horario === "TARDE") {
        return "Tarde";
    }

    return "Noche";
}






export default function AdminTurnos() {
    const {
        data: turnos,
        isLoading,
        isError,
        error,
    } = useTurnos();

    if (isLoading) {
        return (
            <section>
                <p className="text-petro/60">
                    Cargando turnos...
                </p>
            </section>
        );
    }

    if (isError) {
        return (
            <section className="rounded-xl border border-coral/30 bg-coral/5 p-6">
                <p className="font-semibold text-coral">
                    No se pudieron cargar los turnos.
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
                    Turnos
                </h1>

                <p className="mt-2 text-sm text-petro/60">
                    Consulta los turnos registrados en Control107.
                </p>
            </div>

            <div className="rounded-xl bg-blanco p-6 shadow-sm">
                {!turnos || turnos.length === 0 ? (
                    <p className="text-sm text-petro/60">
                        No hay turnos registrados.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-petro/10 text-sm text-petro/60">
                                    <th className="px-3 py-3 font-semibold">
                                        Fecha
                                    </th>

                                    <th className="px-3 py-3 font-semibold">
                                        Horario
                                    </th>

                                    <th className="px-3 py-3 font-semibold">
                                        Estado
                                    </th>

                                    <th className="px-3 py-3 font-semibold">
                                        Enfermero
                                    </th>

                                    <th className="px-3 py-3 font-semibold">
                                        Ambulancia
                                    </th>

                                    <th className="px-3 py-3 font-semibold">
                                        Médico
                                    </th>

                                    <th className="px-3 py-3 font-semibold">
                                        Chofer
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {turnos.map((turno) => (
                                    <tr
                                        key={turno.id}
                                        className="border-b border-petro/10 last:border-b-0"
                                    >
                                        <td className="px-3 py-4 text-sm">
                                            {turno.fecha}
                                        </td>

                                        <td className="px-3 py-4 text-sm font-medium">
                                            {textoHorario(turno.horario)}
                                        </td>

                                        <td className="px-3 py-4">
                                            <span
                                                className={`rounded-md px-2 py-1 text-xs font-semibold ${obtenerColorEstado(
                                                    turno.estado
                                                )}`}
                                            >
                                                {obtenerTextoEstado(
                                                    turno.estado
                                                )}
                                            </span>
                                        </td>

                                        <td className="px-3 py-4 text-sm">
                                            {turno.enfermero.nombre}
                                        </td>

                                        <td className="px-3 py-4 text-sm font-medium">
                                            {turno.ambulancia.patente}
                                        </td>

                                        <td className="px-3 py-4 text-sm">
                                            {turno.medico}
                                        </td>

                                        <td className="px-3 py-4 text-sm">
                                            {turno.chofer}
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