import { useTurnosPorEnfermero } from "../hooks/useTurnos";
import TurnoActual from "../components/Operativo/TurnoActual";
import ControlInsumos from "../components/Operativo/ControlInsumos";

const ENFERMERO_ID = 2; // TODO: eliminar cuando se implemente autenticación

export default function OperativoEnfermero() {
    const {
        data: turnos,
        isLoading,
        isError,
        error,
    } = useTurnosPorEnfermero(ENFERMERO_ID); // ! cambiar cuando se implemente autenticacion

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

    const turnoEnCurso = turnos?.find(
        (turno) => turno.estado === "EN_CURSO"
    );

    if (!turnoEnCurso) {
        return (
            <main className="min-h-screen bg-fondo p-6 text-petro">
                <div className="mx-auto max-w-5xl">
                    <h1 className="mb-6 text-3xl font-bold">
                        Mi turno
                    </h1>

                    <div className="rounded-xl bg-blanco p-6 shadow-sm">
                        <p>No tienes un turno en curso.</p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-fondo p-6 text-petro">
            <div className="mx-auto max-w-5xl">
                <h1 className="mb-6 text-3xl font-bold">
                    Mi turno
                </h1>

                <TurnoActual turno={turnoEnCurso} />
                <ControlInsumos
                    controles={turnoEnCurso.controlInsumos}
                />
            </div>
        </main>
    );
}