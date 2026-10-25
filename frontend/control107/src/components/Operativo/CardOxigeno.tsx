import type { ControlInsumo } from "../../interfaces/Turno";
import { CONFIGURACION_OXIGENO } from "../../config/oxigeno";

interface CardOxigenoProps {
    controles: ControlInsumo[];
}

export default function CardOxigeno({
    controles,
}: CardOxigenoProps) {
    return (
        <section className="rounded-xl border border-ambar/40 bg-blanco p-6 shadow-sm">
            <div className="mb-5">
                <div className="flex items-center gap-3">
                    <span className="rounded-md bg-ambar px-2.5 py-1 text-xs font-bold text-blanco">
                        CRÍTICO
                    </span>

                    <h3 className="text-xl font-semibold text-petro">
                        Oxígeno
                    </h3>
                </div>

                <p className="mt-2 text-sm text-petro/60">
                    Control de presión de los tubos de oxígeno.
                </p>
            </div>

            <div className="space-y-4">
                {controles.map((control) => {
                    const configuracion =
                        CONFIGURACION_OXIGENO[control.nombre];

                    const presionActual =
                        control.cantidadIngreso ?? 0;

                    const presionMaxima =
                        configuracion?.maxBar ?? presionActual;

                    const tieneFaltante =
                        control.ingresoFaltante > 0;

                    const porcentaje =
                        presionMaxima > 0
                            ? Math.min(
                                100,
                                Math.round(
                                    (presionActual / presionMaxima) * 100
                                )
                            )
                            : 0;

                    return (
                        <article
                            key={`${control.categoria}-${control.nombre}`}
                            className="rounded-lg border border-petro/10 bg-fondo p-4"
                        >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <h4 className="font-semibold text-petro">
                                        {control.nombre}
                                    </h4>

                                    <p className="mt-1 text-sm text-petro/60">
                                        Presión registrada
                                    </p>
                                </div>

                                <span
                                    className={
                                        tieneFaltante
                                            ? "w-fit rounded-md bg-coral/10 px-2.5 py-1 text-sm font-semibold text-coral"
                                            : "w-fit rounded-md bg-verde/10 px-2.5 py-1 text-sm font-semibold text-verde"
                                    }
                                >
                                    {tieneFaltante
                                        ? "Cambiar"
                                        : "Correcto"}
                                </span>
                            </div>

                            <div className="mt-4">
                                <div className="mb-2 flex items-end justify-between gap-4">
                                    <p className="font-mono text-2xl font-semibold text-petro">
                                        {presionActual} bar
                                    </p>

                                    <p className="text-sm text-petro/60">
                                        {porcentaje}%
                                    </p>
                                </div>

                                <progress
                                    value={presionActual}
                                    max={presionMaxima}
                                    className="h-3 w-full accent-turquesa"
                                    aria-label={`Presión de ${control.nombre}`}
                                />

                                <div className="mt-2 flex justify-between text-xs text-petro/60">
                                    <span>0 bar</span>

                                    <span>
                                        Máximo: {presionMaxima} bar
                                    </span>
                                </div>
                            </div>

                            {tieneFaltante && (
                                <div className="mt-4 rounded-lg border border-coral/30 bg-coral/5 p-3">
                                    <p className="text-sm font-semibold text-coral">
                                        Presión por debajo del punto de control
                                    </p>

                                    <p className="mt-1 text-sm text-petro/70">
                                        Faltante registrado:{" "}
                                        {control.ingresoFaltante} bar
                                    </p>
                                </div>
                            )}

                            {!configuracion && (
                                <p className="mt-3 text-xs text-ambar">
                                    No se encontró una presión máxima configurada
                                    para este producto.
                                </p>
                            )}
                        </article>
                    );
                })}
            </div>
        </section>
    );
}