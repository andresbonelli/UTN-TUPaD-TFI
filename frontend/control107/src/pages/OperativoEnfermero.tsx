import { useTurnosPorEnfermero } from "../hooks/useTurnos";
import TurnoActual from "../components/Operativo/TurnoActual";
import ControlInsumos from "../components/Operativo/ControlInsumos";
import ControlIngreso from "../components/Operativo/ControlIngreso";
import ControlEgreso from "../components/Operativo/ControlEgreso";
import CancelarTurno from "../components/Operativo/CancelarTurno";
import BotonLogout from "../components/Auth/BotonLogout";


export default function OperativoEnfermero() {

const {
    data: turnos,
    isLoading,
    isError,
    error,
} = useTurnosPorEnfermero();

    if (isLoading) {
        return (
            <main className="min-h-screen bg-fondo p-6 text-petro">
                <div className="mx-auto max-w-5xl">
                    <p>Cargando turno...</p>
                </div>
            </main>
        );
    }

    if (isError) {
        return (
            <main className="min-h-screen bg-fondo p-6 text-petro">
                <div className="mx-auto max-w-5xl">
                    <p className="text-coral">
                        Error al obtener los turnos.
                    </p>

                    <p className="mt-1 text-sm text-petro/60">
                        {error.message}
                    </p>
                </div>
            </main>
        );
    }


    const turnoOperativo =
        turnos?.find((turno) => turno.estado === "EN_CURSO") ??
        turnos?.find((turno) => turno.estado === "PROGRAMADO");

    if (!turnoOperativo) {
        return (
            <main className="min-h-screen bg-fondo p-6 text-petro">
                <div className="mx-auto max-w-5xl">

                    <div className="mb-6 flex items-center justify-between gap-4">
                        <h1 className="text-3xl font-bold">
                            Mi turno
                        </h1>

                        <BotonLogout />
                    </div>

                    <div className="rounded-xl bg-blanco p-6 shadow-sm">
                        <p>No tienes un turno operativo asignado.</p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-fondo p-6 text-petro">
            <div className="mx-auto max-w-5xl">
                <div className="mb-6 flex items-center justify-between gap-4">
                    <h1 className="text-3xl font-bold">
                        Mi turno
                    </h1>

                    <BotonLogout />
                </div>

                
                <TurnoActual turno={turnoOperativo} />

                <div className="my-8 border-t border-petro/10" />

                {turnoOperativo.estado === "EN_CURSO" && (
                    <>
                        <ControlInsumos
                            controles={turnoOperativo.controlInsumos}
                        />

                        <ControlEgreso
                            turnoId={turnoOperativo.id}
                            controles={turnoOperativo.controlInsumos}
                        />
                    </>
                )}

                {turnoOperativo.estado === "PROGRAMADO" && (
                    <>
                        <ControlIngreso
                            turnoId={turnoOperativo.id}
                            controles={turnoOperativo.controlInsumos}
                        />

                        <div className="my-8 border-t border-petro/10" />

                        <CancelarTurno
                            turnoId={turnoOperativo.id}
                        />
                    </>
                )}
            </div>
        </main>
    );
}
