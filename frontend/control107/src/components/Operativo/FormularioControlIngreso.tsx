import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { useRegistrarIngreso } from "../../hooks/useTurnos";
import type {
    ControlInsumo,
    IngresoEgresoRequest,
} from "../../interfaces/Turno";

interface FormularioControlIngresoProps {
    turnoId: number;
    controles: ControlInsumo[];
}

interface CantidadIngreso {
    insumoId: number;
    cantidad: number;
}

interface ControlIngresoFormValues {
    insumos: CantidadIngreso[];
    observaciones: string;
}

// const CONTROLES_POR_PAGINA = 20;

export default function FormularioControlIngreso({
    turnoId,
    controles,
}: FormularioControlIngresoProps) {
    const registrarIngresoMutation = useRegistrarIngreso();

    const [pagina, setPagina] = useState(0);
    const [controlesPorPagina, setControlesPorPagina] = useState(20);

    const totalPaginas = Math.ceil(
        controles.length / controlesPorPagina,
    );

    const inicio = pagina * controlesPorPagina;

    const controlesPagina = controles
        .map((control, index) => ({
            control,
            index,
        }))
        .slice(
            inicio,
            inicio + controlesPorPagina,
        );

    const form = useForm({
        defaultValues: {
            insumos: controles.map((control) => ({
                insumoId: control.insumoId,
                cantidad: 0,
            })),
            observaciones: "",
        } as ControlIngresoFormValues,

        validators: {
            onSubmit: ({ value }) => {
                const tieneCantidadNegativa = value.insumos.some(
                    (item) => item.cantidad < 0,
                );

                if (tieneCantidadNegativa) {
                    return "Las cantidades no pueden ser negativas";
                }

                return undefined;
            },
        },

        onSubmit: async ({ value }) => {
            const request: IngresoEgresoRequest = {
                turnoId,

                insumos: value.insumos.map((item) => ({
                    id: item.insumoId,
                    cantidad: item.cantidad,
                    cantidadRestockeo: 0,
                })),

                observaciones: value.observaciones.trim(),
            };

            registrarIngresoMutation.mutate(request);
        },
    });

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                form.handleSubmit();
            }}
            className="mt-6 space-y-6"
        >
            <p className="text-sm text-petro/60">
                Insumos a controlar: {controles.length}
            </p>

            <div className="space-y-4">
                {controlesPagina.map(({ control, index }) => {
                    const esOxigeno = control.esOxigeno;

                    return (
                        <article
                            key={control.insumoId}
                            className={
                                esOxigeno
                                    ? "rounded-xl border border-ambar/40 bg-ambar/5 p-4"
                                    : control.esCritico
                                        ? "rounded-xl border border-coral/30 bg-coral/5 p-4"
                                        : "rounded-xl border border-petro/10 bg-fondo p-4"
                            }
                        >
                            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <p className="font-semibold text-petro">{control.nombre}</p>

                                    <div className="mt-1">
                                        <span
                                            className="inline-block rounded-full border px-2 py-1 text-xs font-semibold"
                                            style={{
                                                borderColor: control.colorCategoria,
                                                color: control.colorCategoria,
                                                backgroundColor: `${control.colorCategoria}15`,
                                            }}
                                        >
                                            {control.categoria}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {esOxigeno && (
                                        <span className="rounded-md bg-ambar/10 px-2 py-1 text-xs font-semibold text-ambar">
                                            Oxígeno
                                        </span>
                                    )}

                                    {control.esCritico && (
                                        <span className="rounded-md bg-coral/10 px-2 py-1 text-xs font-semibold text-coral">
                                            Crítico
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <form.Field
                                    name={`insumos[${index}].cantidad`}
                                    validators={{
                                        onChange: ({ value }) => {
                                            if (value < 0) {
                                                return "La cantidad no puede ser negativa";
                                            }

                                            if (
                                                esOxigeno &&
                                                value > control.capacidadMaxima
                                            ) {
                                                return `La presión no puede superar ${control.capacidadMaxima} bar`;
                                            }

                                            return undefined;
                                        },
                                    }}
                                >
                                    {(field) => (
                                        <div>
                                            <label
                                                htmlFor={field.name}
                                                className="text-sm font-medium text-petro"
                                            >
                                                {esOxigeno
                                                    ? "Presion encontrada"
                                                    : "Cantidad encontrada"}
                                            </label>

                                            <div className="mt-2 flex items-center gap-3">
                                                <input
                                                    id={field.name}
                                                    name={field.name}
                                                    type="number"
                                                    min="0"
                                                    max={esOxigeno ? control.capacidadMaxima : undefined}
                                                    step="1"
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(event) =>
                                                        field.handleChange(Number(event.target.value))
                                                    }
                                                    className="w-full rounded-lg border border-petro/20 bg-blanco px-3 py-2 text-petro outline-none focus:border-turquesa focus:ring-2 focus:ring-turquesa/20"
                                                />

                                                <span className="min-w-fit text-sm font-medium text-petro/60">
                                                    {esOxigeno ? "bar" : "unidades"}
                                                </span>
                                            </div>

                                            {field.state.meta.errors.map((error) => (
                                                <p
                                                    key={String(error)}
                                                    className="mt-1 text-xs text-coral"
                                                >
                                                    {String(error)}
                                                </p>
                                            ))}
                                        </div>
                                    )}
                                </form.Field>

                                <div>
                                    <p className="text-sm font-medium text-petro">
                                        Punto de control
                                    </p>

                                    <p className="mt-2 rounded-lg bg-blanco px-3 py-2 font-semibold text-petro">
                                        {control.puntoControl} {esOxigeno ? "bar" : "unidades"}
                                    </p>

                                    {esOxigeno && (
                                        <p className="mt-2 text-sm text-petro/60">
                                            Capacidad máxima: {control.capacidadMaxima} bar
                                        </p>
                                    )}
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>

            {totalPaginas > 1 && (
                <div className="flex flex-col gap-3 rounded-lg border border-petro/10 bg-petro/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <p className="text-sm text-petro/60">
                            Mostrando {inicio + 1}-
                            {Math.min(
                                inicio + controlesPorPagina,
                                controles.length,
                            )} de {controles.length}
                        </p>

                        <label className="flex items-center gap-2 text-sm text-petro/60">
                            Por página

                            <select
                                value={controlesPorPagina}
                                onChange={(event) => {
                                    setControlesPorPagina(
                                        Number(event.target.value),
                                    );
                                    setPagina(0);
                                }}
                                className="rounded-lg border border-petro/20 bg-blanco px-2 py-1 text-sm text-petro outline-none focus:border-turquesa"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                        </label>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() =>
                                setPagina((paginaActual) =>
                                    Math.max(0, paginaActual - 1)
                                )
                            }
                            disabled={pagina === 0}
                            className="rounded-lg border border-petro/20 bg-blanco px-3 py-2 text-sm font-semibold text-petro disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Anterior
                        </button>

                        <span className="text-sm font-medium text-petro">
                            Página {pagina + 1} de {totalPaginas}
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                setPagina((paginaActual) =>
                                    Math.min(
                                        totalPaginas - 1,
                                        paginaActual + 1,
                                    )
                                )
                            }
                            disabled={pagina >= totalPaginas - 1}
                            className="rounded-lg border border-petro/20 bg-blanco px-3 py-2 text-sm font-semibold text-petro disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            )}

            <form.Field name="observaciones">
                {(field) => (
                    <div>
                        <label
                            htmlFor={field.name}
                            className="text-sm font-medium text-petro"
                        >
                            Observaciones
                        </label>

                        <textarea
                            id={field.name}
                            name={field.name}
                            rows={4}
                            placeholder="Registra faltantes, condiciones críticas u otras observaciones"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(event) => field.handleChange(event.target.value)}
                            className="mt-2 w-full resize-none rounded-lg border border-petro/20 bg-blanco px-3 py-2 text-petro outline-none focus:border-turquesa focus:ring-2 focus:ring-turquesa/20"
                        />
                    </div>
                )}
            </form.Field>

            {registrarIngresoMutation.isError && (
                <div className="rounded-lg border border-coral/30 bg-coral/5 p-4">
                    <p className="font-semibold text-coral">
                        No se pudo registrar el control de ingreso.
                    </p>

                    <p className="mt-1 text-sm text-petro/70">
                        {registrarIngresoMutation.error.message}
                    </p>
                </div>
            )}

            <button
                type="submit"
                disabled={registrarIngresoMutation.isPending}
                className="rounded-lg bg-turquesa px-4 py-2 text-sm font-semibold text-blanco transition hover:bg-petro disabled:cursor-not-allowed disabled:opacity-50"
            >
                {registrarIngresoMutation.isPending
                    ? "Registrando..."
                    : "Registrar control de ingreso"}
            </button>
        </form>
    );
}
