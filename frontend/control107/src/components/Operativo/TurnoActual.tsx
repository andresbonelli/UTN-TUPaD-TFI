import type { Turno } from "../../interfaces/Turno";

interface TurnoActualProps {
    turno: Turno;
}

export default function TurnoActual({ turno }: TurnoActualProps) {

    const estadoTexto =
        turno.estado === "PROGRAMADO"
            ? "Programado"
            : turno.estado === "EN_CURSO"
                ? "En curso"
                : turno.estado;

const estadoColor =
    turno.estado === "PROGRAMADO"
        ? "bg-azul/10 text-azul"
        : turno.estado === "EN_CURSO"
            ? "bg-verde/10 text-verde"
            : turno.estado === "CANCELADO"
                ? "bg-coral/10 text-coral"
                : "bg-petro/10 text-petro";

    return (
        <section className="rounded-xl bg-blanco p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <p className="text-sm text-petro/60">Turno #{turno.id}</p>

                    <h2 className="text-2xl font-semibold text-petro">
                        Ambulancia {turno.ambulancia.patente}
                    </h2>
                </div>

                <span
                    className={`rounded-lg px-3 py-2 text-sm font-semibold ${estadoColor}`}
                >
                    {estadoTexto}
                </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                    <p className="text-sm text-petro/60">Fecha</p>

                    <p className="font-medium">{turno.fecha}</p>
                </div>

                <div>
                    <p className="text-sm text-petro/60">Horario</p>

                    <p className="font-medium">{turno.horario}</p>
                </div>

                <div>
                    <p className="text-sm text-petro/60">Médico</p>

                    <p className="font-medium">{turno.medico}</p>
                </div>

                <div>
                    <p className="text-sm text-petro/60">Chofer</p>

                    <p className="font-medium">{turno.chofer}</p>
                </div>
            </div>

            {turno.observacionesIngreso && (
                <div className="mt-6 rounded-lg border border-ambar bg-ambar/10 p-4">
                    <p className="text-sm font-semibold text-petro">
                        Observaciones de ingreso
                    </p>

                    <p className="mt-1 text-sm text-petro/80">
                        {turno.observacionesIngreso}
                    </p>
                </div>
            )}
        </section>
    );
}
