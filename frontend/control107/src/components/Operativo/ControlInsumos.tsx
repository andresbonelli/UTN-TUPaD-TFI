import type { ControlInsumo } from "../../interfaces/Turno";
import { useState } from "react";

import CardOxigeno from "./CardOxigeno";

interface ControlInsumosProps {
    controles: ControlInsumo[];
}

type CantidadPorPagina = 5 | 10 | 20 | 50 | "todos";

export default function ControlInsumos({ controles }: ControlInsumosProps) {
    const esControlOxigeno = (control: ControlInsumo) => control.esOxigeno;

    const controlesOxigeno = controles.filter(esControlOxigeno);

    const controlesCriticos = controles.filter(
        (control) => control.esCritico && !esControlOxigeno(control),
    );

    const controlesNormales = controles.filter((control) => !control.esCritico);

    const [paginaCriticos, setPaginaCriticos] = useState(0);
    const [paginaNormales, setPaginaNormales] = useState(0);

    const [cantidadCriticos, setCantidadCriticos] =
        useState<CantidadPorPagina>(20);

    const [cantidadNormales, setCantidadNormales] =
        useState<CantidadPorPagina>(20);

    const totalPaginasCriticos =
        cantidadCriticos === "todos"
            ? 1
            : Math.ceil(
                controlesCriticos.length / cantidadCriticos,
            );

    const inicioCriticos =
        cantidadCriticos === "todos"
            ? 0
            : paginaCriticos * cantidadCriticos;

    const criticosPagina =
        cantidadCriticos === "todos"
            ? controlesCriticos
            : controlesCriticos.slice(
                inicioCriticos,
                inicioCriticos + cantidadCriticos,
            );

    const totalPaginasNormales =
        cantidadNormales === "todos"
            ? 1
            : Math.ceil(
                controlesNormales.length / cantidadNormales,
            );

    const inicioNormales =
        cantidadNormales === "todos"
            ? 0
            : paginaNormales * cantidadNormales;

    const normalesPagina =
        cantidadNormales === "todos"
            ? controlesNormales
            : controlesNormales.slice(
                inicioNormales,
                inicioNormales + cantidadNormales,
            );

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
                <CardOxigeno controles={controlesOxigeno} />
            )}

            <div className="my-8 border-t border-petro/10" />

            {controlesCriticos.length > 0 && (
                <div>
                    <h3 className="mb-3 text-lg font-semibold text-petro">
                        Control prioritario
                    </h3>

                    <div className="space-y-3">
                        {criticosPagina.map((control) => (
                            <div
                                key={`${control.categoria}-${control.nombre}`}
                                className="rounded-xl border border-coral/30 bg-coral/5 p-4"
                            >
                                <div className="flex items-start justify-between gap-4">
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

                    <div className="mt-4 flex flex-col gap-3 rounded-lg border border-petro/10 bg-petro/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <p className="text-sm text-petro/60">
                                {cantidadCriticos === "todos"
                                    ? `Mostrando todos (${controlesCriticos.length})`
                                    : `Mostrando ${inicioCriticos + 1}-${Math.min(
                                        inicioCriticos + cantidadCriticos,
                                        controlesCriticos.length,
                                    )} de ${controlesCriticos.length}`}
                            </p>

                            <label className="flex items-center gap-2 text-sm text-petro/60">
                                Por página

                                <select
                                    value={cantidadCriticos}
                                    onChange={(event) => {
                                        const value = event.target.value;

                                        setCantidadCriticos(
                                            value === "todos"
                                                ? "todos"
                                                : (Number(value) as 5 | 10 | 20 | 50),
                                        );

                                        setPaginaCriticos(0);
                                    }}
                                    className="rounded-lg border border-petro/20 bg-blanco px-2 py-1 text-sm text-petro outline-none focus:border-turquesa"
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                    <option value="todos">Todos</option>
                                </select>
                            </label>
                        </div>

                        {cantidadCriticos !== "todos" && totalPaginasCriticos > 1 && (
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setPaginaCriticos((paginaActual) =>
                                            Math.max(0, paginaActual - 1)
                                        )
                                    }
                                    disabled={paginaCriticos === 0}
                                    className="rounded-lg border border-petro/20 bg-blanco px-3 py-2 text-sm font-semibold text-petro disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Anterior
                                </button>

                                <span className="text-sm font-medium text-petro">
                                    Página {paginaCriticos + 1} de {totalPaginasCriticos}
                                </span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setPaginaCriticos((paginaActual) =>
                                            Math.min(
                                                totalPaginasCriticos - 1,
                                                paginaActual + 1,
                                            )
                                        )
                                    }
                                    disabled={paginaCriticos >= totalPaginasCriticos - 1}
                                    className="rounded-lg border border-petro/20 bg-blanco px-3 py-2 text-sm font-semibold text-petro disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Siguiente
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="my-8 border-t border-petro/10" />

            {controlesNormales.length > 0 && (
                <div>
                    <h3 className="mb-3 text-lg font-semibold text-petro">
                        Resto de insumos
                    </h3>

                    <div className="space-y-3">
                        {normalesPagina.map((control) => (
                            <div
                                key={`${control.categoria}-${control.nombre}`}
                                className="rounded-xl border border-petro/10 bg-blanco p-4"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="font-medium text-petro">{control.nombre}</p>

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

                    <div className="mt-4 flex flex-col gap-3 rounded-lg border border-petro/10 bg-petro/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <p className="text-sm text-petro/60">
                                {cantidadNormales === "todos"
                                    ? `Mostrando todos (${controlesNormales.length})`
                                    : `Mostrando ${inicioNormales + 1}-${Math.min(
                                        inicioNormales + cantidadNormales,
                                        controlesNormales.length,
                                    )} de ${controlesNormales.length}`}
                            </p>

                            <label className="flex items-center gap-2 text-sm text-petro/60">
                                Por página

                                <select
                                    value={cantidadNormales}
                                    onChange={(event) => {
                                        const value = event.target.value;

                                        setCantidadNormales(
                                            value === "todos"
                                                ? "todos"
                                                : (Number(value) as 5 | 10 | 20 | 50),
                                        );

                                        setPaginaNormales(0);
                                    }}
                                    className="rounded-lg border border-petro/20 bg-blanco px-2 py-1 text-sm text-petro outline-none focus:border-turquesa"
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                    <option value="todos">Todos</option>
                                </select>
                            </label>
                        </div>

                        {cantidadNormales !== "todos" && totalPaginasNormales > 1 && (
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setPaginaNormales((paginaActual) =>
                                            Math.max(0, paginaActual - 1)
                                        )
                                    }
                                    disabled={paginaNormales === 0}
                                    className="rounded-lg border border-petro/20 bg-blanco px-3 py-2 text-sm font-semibold text-petro disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Anterior
                                </button>

                                <span className="text-sm font-medium text-petro">
                                    Página {paginaNormales + 1} de {totalPaginasNormales}
                                </span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setPaginaNormales((paginaActual) =>
                                            Math.min(
                                                totalPaginasNormales - 1,
                                                paginaActual + 1,
                                            )
                                        )
                                    }
                                    disabled={
                                        paginaNormales >= totalPaginasNormales - 1
                                    }
                                    className="rounded-lg border border-petro/20 bg-blanco px-3 py-2 text-sm font-semibold text-petro disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Siguiente
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            <div className="my-8 border-t border-petro/10" />

        </section>
    );
}
