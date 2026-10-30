import type { ControlInsumo } from "../../interfaces/Turno";
import CategoriaBadge from "../CategoriaBadge";
import { useInsumos } from "../../hooks/useInsumos";
import CardOxigeno from "./CardOxigeno";

interface ControlInsumosProps {
    controles: ControlInsumo[];
}

export default function ControlInsumos({ controles }: ControlInsumosProps) {
    const { data: insumos = [], isLoading, isError } = useInsumos();

    const esControlOxigeno = (control: ControlInsumo) =>
        insumos.some(
            (insumo) => insumo.nombre === control.nombre && insumo.esOxigeno,
        );

    const controlesOxigeno = controles.filter(esControlOxigeno);

    const controlesCriticos = controles.filter(
        (control) => control.esCritico && !esControlOxigeno(control),
    );

    const controlesNormales = controles.filter((control) => !control.esCritico);

    if (isLoading) {
        return (
            <section className="mt-6 rounded-xl bg-blanco p-6 shadow-sm">
                <p className="text-petro">Cargando control de insumos...</p>
            </section>
        );
    }

    if (isError) {
        return (
            <section className="mt-6 rounded-xl border border-coral/30 bg-coral/5 p-6">
                <p className="font-semibold text-coral">
                    No se pudo cargar el catálogo de insumos.
                </p>
            </section>
        );
    }

    return (
        <section className="mt-6 space-y-6">
            <div>
                <h2 className="mb-1 text-2xl font-semibold text-petro">
                    Control de insumos
                </h2>

                <p className="text-sm text-petro/60">
                    Estado registrado durante el turno.
                </p>
            </div>

            {controlesOxigeno.length > 0 && (
                <CardOxigeno controles={controlesOxigeno} insumos={insumos} />
            )}

            {controlesCriticos.length > 0 && (
                <div>
                    <h3 className="mb-3 text-lg font-semibold text-petro">
                        Control prioritario
                    </h3>

                    <div className="space-y-3">
                        {controlesCriticos.map((control) => (
                            <div
                                key={`${control.categoria}-${control.nombre}`}
                                className="rounded-xl border border-coral/30 bg-coral/5 p-4"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="font-semibold text-petro">{control.nombre}</p>

                                        <div className="mt-1">
                                            <CategoriaBadge nombre={control.categoria} />
                                        </div>
                                    </div>

                                    <span className="rounded-md bg-coral px-2 py-1 text-xs font-semibold text-blanco">
                                        Crítico
                                    </span>
                                </div>

                                <div className="mt-4 flex gap-6">
                                    <div>
                                        <p className="text-xs text-petro/60">Ingreso</p>

                                        <p className="font-semibold text-petro">
                                            {/* {control.cantidadIngreso ?? "Sin registrar"} */}
                                            {control.cantidadIngreso}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-petro/60">Faltante</p>

                                        <p
                                            className={
                                                control.ingresoFaltante > 0
                                                    ? "font-semibold text-coral"
                                                    : "font-semibold text-verde"
                                            }
                                        >
                                            {control.ingresoFaltante}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {controlesNormales.length > 0 && (
                <div>
                    <h3 className="mb-3 text-lg font-semibold text-petro">
                        Resto de insumos
                    </h3>

                    <div className="space-y-3">
                        {controlesNormales.map((control) => (
                            <div
                                key={`${control.categoria}-${control.nombre}`}
                                className="rounded-xl border border-petro/10 bg-blanco p-4"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="font-medium text-petro">{control.nombre}</p>

                                        <div className="mt-1">
                                            <CategoriaBadge nombre={control.categoria} />
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-xs text-petro/60">Ingreso</p>

                                        <p className="font-semibold text-petro">
                                            {/* {control.cantidadIngreso ?? "Sin registrar"} */}
                                            {control.cantidadIngreso}
                                        </p>
                                    </div>
                                </div>

                                {control.ingresoFaltante > 0 && (
                                    <p className="mt-3 text-sm font-semibold text-coral">
                                        Faltante: {control.ingresoFaltante}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
