import { useTurnosPorEnfermero } from "../hooks/useTurnos";
import TurnoActual from "../components/Operativo/TurnoActual";
import ControlInsumos from "../components/Operativo/ControlInsumos";
import ControlIngreso from "../components/Operativo/ControlIngreso";
import ControlEgreso from "../components/Operativo/ControlEgreso";

// ! Eliminar cuando esten los logins
const ENFERMERO_ID = 2; // TODO: eliminar cuando se implemente autenticación
const TURNO_PRUEBA_ID = 33; // TODO: eliminar después de probar control de ingreso

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

    // const turnoOperativo =
    //     turnos?.find(
    //         (turno) => turno.estado === "EN_CURSO"
    //     ) ??
    //     turnos?.find(
    //         (turno) => turno.estado === "PROGRAMADO"
    //     );

    // ! Solo para DEBUG -> eliminar
    const turnoOperativo = turnos?.find(
        (turno) => turno.id === TURNO_PRUEBA_ID
    );
    // ! Eliminar hast aca DEBUG

    if (!turnoOperativo) {
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

                <TurnoActual turno={turnoOperativo} />

                {/* {turnoOperativo.estado === "EN_CURSO" && (
                    <ControlInsumos
                        controles={turnoOperativo.controlInsumos}
                    />
                )} */}

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
                    <ControlIngreso
                        turnoId={turnoOperativo.id}
                        controles={turnoOperativo.controlInsumos}
                    />
                )}
            </div>
        </main>
    );
}