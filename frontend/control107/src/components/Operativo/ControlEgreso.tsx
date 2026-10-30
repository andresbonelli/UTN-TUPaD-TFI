import FormularioControlEgreso from "./FormularioControlEgreso";
import type { ControlInsumo } from "../../interfaces/Turno";

interface ControlEgresoProps {
    turnoId: number;
    controles: ControlInsumo[];
}

export default function ControlEgreso({
    turnoId,
    controles,
}: ControlEgresoProps) {
    return (
        <section className="mt-6 rounded-xl bg-blanco p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-petro">
                Control de egreso
            </h2>

            <p className="mt-2 text-sm text-petro/60">
                Registra las cantidades al finalizar el turno y las reposiciones
                realizadas durante la guardia.
            </p>

            {controles.length > 0 ? (
                <FormularioControlEgreso
                    turnoId={turnoId}
                    controles={controles}
                />
            ) : (
                <p className="mt-6 text-sm text-petro/60">
                    No hay insumos disponibles para registrar el egreso.
                </p>
            )}
        </section>
    );
}