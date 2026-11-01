
import type { ControlInsumo } from "../../interfaces/Turno";
import FormularioControlIngreso from "./FormularioControlIngreso";

interface ControlIngresoProps {
    turnoId: number;
    controles: ControlInsumo[];
}

export default function ControlIngreso({
    turnoId,
    controles,
}: ControlIngresoProps) {
    return (
        <section className="mt-6 rounded-xl bg-blanco p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-petro">
                Control de ingreso
            </h2>

            <p className="mt-2 text-sm text-petro/60">
                Registra la cantidad encontrada de cada insumo antes de iniciar
                el turno.
            </p>

            {controles.length > 0 ? (
                <FormularioControlIngreso
                    turnoId={turnoId}
                    controles={controles}
                />
            ) : (
                <p className="mt-6 text-sm text-petro/60">
                    No hay insumos disponibles para controlar.
                </p>
            )}
        </section>
    );
}