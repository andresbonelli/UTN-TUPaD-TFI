import { useInsumos } from "../../hooks/useInsumos";
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
    const {
        data: insumos,
        isLoading,
        isError,
        error,
    } = useInsumos();

    if (isLoading) {
        return (
            <section className="mt-6 rounded-xl bg-blanco p-6 shadow-sm">
                <p className="text-petro">
                    Cargando insumos...
                </p>
            </section>
        );
    }

    if (isError) {
        return (
            <section className="mt-6 rounded-xl bg-blanco p-6 shadow-sm">
                <p className="font-semibold text-coral">
                    Error al obtener los insumos.
                </p>

                <p className="mt-1 text-sm text-petro/60">
                    {error.message}
                </p>
            </section>
        );
    }

    const controlesRelacionados = controles.flatMap(
        (control) => {
            const insumo = insumos?.find(
                (item) => item.nombre === control.nombre
            );

            if (!insumo) {
                return [];
            }

            return [
                {
                    control,
                    insumo,
                },
            ];
        }
    );

    const controlesSinInsumo = controles.filter(
        (control) =>
            !insumos?.some(
                (insumo) => insumo.nombre === control.nombre
            )
    );

    return (
        <section className="mt-6 rounded-xl bg-blanco p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-petro">
                Control de egreso
            </h2>

            <p className="mt-2 text-sm text-petro/60">
                Registra las cantidades al finalizar el turno y las reposiciones realizadas durante la guardia.
            </p>

            {controlesSinInsumo.length > 0 && (
                <div className="mt-4 rounded-lg border border-coral/30 bg-coral/5 p-4">
                    <p className="font-semibold text-coral">
                        No se pudieron relacionar algunos controles con el catálogo.
                    </p>

                    <ul className="mt-2 list-inside list-disc text-sm text-petro/70">
                        {controlesSinInsumo.map((control) => (
                            <li
                                key={`${control.categoria}-${control.nombre}`}
                            >
                                {control.nombre}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {controlesRelacionados.length > 0 ? (
                <FormularioControlEgreso
                    turnoId={turnoId}
                    controles={controlesRelacionados}
                />
            ) : (
                <p className="mt-6 text-sm text-petro/60">
                    No hay insumos disponibles para registrar el egreso.
                </p>
            )}
        </section>
    );
}