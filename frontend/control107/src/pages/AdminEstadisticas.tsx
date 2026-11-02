import { useState } from "react";

import { useTurnos } from "../hooks/useTurnos";

type PeriodoEstadisticas =
    | "HOY"
    | "SEMANA"
    | "MES"
    | "ANIO"
    | "HISTORICO";

const PERIODOS: {
    valor: PeriodoEstadisticas;
    etiqueta: string;
}[] = [
    { valor: "HOY", etiqueta: "Hoy" },
    { valor: "SEMANA", etiqueta: "Semana" },
    { valor: "MES", etiqueta: "Mes" },
    { valor: "ANIO", etiqueta: "Año" },
    { valor: "HISTORICO", etiqueta: "Histórico" },
];

function crearFechaLocal(fecha: string): Date {
    const [anio, mes, dia] =
        fecha.split("-").map(Number);

    return new Date(
        anio,
        mes - 1,
        dia,
    );
}

function obtenerInicioDia(fecha: Date): Date {
    return new Date(
        fecha.getFullYear(),
        fecha.getMonth(),
        fecha.getDate(),
    );
}

function obtenerInicioSemana(fecha: Date): Date {
    const inicio = obtenerInicioDia(fecha);

    const diaSemana = inicio.getDay();

    const diasDesdeLunes =
        diaSemana === 0
            ? 6
            : diaSemana - 1;

    inicio.setDate(
        inicio.getDate() - diasDesdeLunes,
    );

    return inicio;
}

function estaDentroDelPeriodo(
    fecha: string,
    periodo: PeriodoEstadisticas,
): boolean {
    if (periodo === "HISTORICO") {
        return true;
    }

    const hoy = obtenerInicioDia(new Date());

    const fechaTurno =
        crearFechaLocal(fecha);

    if (periodo === "HOY") {
        return (
            fechaTurno.getTime() ===
            hoy.getTime()
        );
    }

    if (periodo === "SEMANA") {
        const inicioSemana =
            obtenerInicioSemana(hoy);

        const finSemana =
            new Date(inicioSemana);

        finSemana.setDate(
            finSemana.getDate() + 6,
        );

        return (
            fechaTurno >= inicioSemana &&
            fechaTurno <= finSemana
        );
    }

    if (periodo === "MES") {
        return (
            fechaTurno.getFullYear() ===
                hoy.getFullYear() &&
            fechaTurno.getMonth() ===
                hoy.getMonth()
        );
    }

    if (periodo === "ANIO") {
        return (
            fechaTurno.getFullYear() ===
            hoy.getFullYear()
        );
    }

    return false;
}

export const AdminEstadisticas = () => {
    const [periodo, setPeriodo] =
        useState<PeriodoEstadisticas>(
            "HISTORICO",
        );

    const {
        data: turnos = [],
        isLoading,
        isError,
    } = useTurnos();

    if (isLoading) {
        return (
            <section className="text-petro">
                <p className="text-sm text-petro/60">
                    Cargando estadísticas...
                </p>
            </section>
        );
    }

    if (isError) {
        return (
            <section className="rounded-xl border border-coral/30 bg-coral/5 p-6">
                <p className="text-sm font-semibold text-coral">
                    No se pudieron cargar las estadísticas.
                </p>
            </section>
        );
    }

    const turnosCerrados =
        turnos.filter(
            (turno) =>
                (
                    turno.estado === "FINALIZADO" ||
                    turno.estado === "CANCELADO"
                ) &&
                estaDentroDelPeriodo(
                    turno.fecha,
                    periodo,
                ),
        );

    const totalCerrados =
        turnosCerrados.length;

    const turnosFinalizados =
        turnosCerrados.filter(
            (turno) =>
                turno.estado === "FINALIZADO",
        ).length;

    const turnosCancelados =
        turnosCerrados.filter(
            (turno) =>
                turno.estado === "CANCELADO",
        ).length;

    const turnosConFaltantes =
        turnosCerrados.filter(
            (turno) =>
                turno.controlInsumos.some(
                    (insumo) =>
                        insumo.ingresoFaltante > 0,
                ),
        ).length;

    const turnosConFaltantesCriticos =
        turnosCerrados.filter(
            (turno) =>
                turno.controlInsumos.some(
                    (insumo) =>
                        insumo.ingresoFaltante > 0 &&
                        insumo.esCritico,
                ),
        ).length;

    const porcentajeCancelacion =
        totalCerrados > 0
            ? (
                turnosCancelados /
                totalCerrados
            ) * 100
            : 0;

    const porcentajeConFaltantes =
        totalCerrados > 0
            ? (
                turnosConFaltantes /
                totalCerrados
            ) * 100
            : 0;

    const porcentajeConFaltantesCriticos =
        totalCerrados > 0
            ? (
                turnosConFaltantesCriticos /
                totalCerrados
            ) * 100
            : 0;

    return (
        <section className="text-petro">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">
                    Estadísticas
                </h1>

                <p className="mt-2 text-sm text-petro/60">
                    Análisis de los turnos finalizados y cancelados.
                </p>
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
                {PERIODOS.map((opcion) => (
                    <button
                        key={opcion.valor}
                        type="button"
                        onClick={() =>
                            setPeriodo(
                                opcion.valor,
                            )
                        }
                        className={
                            periodo === opcion.valor
                                ? "rounded-lg bg-turquesa px-4 py-2 text-sm font-semibold text-blanco"
                                : "rounded-lg border border-petro/20 bg-blanco px-4 py-2 text-sm font-medium text-petro transition hover:bg-petro/5"
                        }
                    >
                        {opcion.etiqueta}
                    </button>
                ))}
            </div>

            <div className="mb-4">
                <h2 className="text-xl font-semibold text-petro">
                    Turnos cerrados
                </h2>

                <p className="mt-1 text-sm text-petro/60">
                    Resultados correspondientes al período seleccionado.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl bg-blanco p-6 shadow-sm">
                    <p className="text-sm font-medium text-petro/60">
                        Total cerrados
                    </p>

                    <p className="mt-2 text-3xl font-bold text-petro">
                        {totalCerrados}
                    </p>
                </div>

                <div className="rounded-xl bg-blanco p-6 shadow-sm">
                    <p className="text-sm font-medium text-petro/60">
                        Finalizados
                    </p>

                    <p className="mt-2 text-3xl font-bold text-verde">
                        {turnosFinalizados}
                    </p>
                </div>

                <div className="rounded-xl bg-blanco p-6 shadow-sm">
                    <p className="text-sm font-medium text-petro/60">
                        Cancelados
                    </p>

                    <p className="mt-2 text-3xl font-bold text-coral">
                        {turnosCancelados}
                    </p>
                </div>

                <div className="rounded-xl bg-blanco p-6 shadow-sm">
                    <p className="text-sm font-medium text-petro/60">
                        Tasa de cancelación
                    </p>

                    <p className="mt-2 text-3xl font-bold text-ambar">
                        {porcentajeCancelacion.toFixed(1)} %
                    </p>
                </div>
            </div>

            <div className="my-8 border-t border-petro/10" />

            <div className="mb-4">
                <h2 className="text-xl font-semibold text-petro">
                    Controles de ingreso
                </h2>

                <p className="mt-1 text-sm text-petro/60">
                    Incidencias detectadas durante el período seleccionado.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-blanco p-6 shadow-sm">
                    <p className="text-sm font-medium text-petro/60">
                        Turnos con faltantes al ingreso
                    </p>

                    <p className="mt-2 text-3xl font-bold text-ambar">
                        {turnosConFaltantes}
                    </p>

                    <p className="mt-1 text-sm text-petro/50">
                        {porcentajeConFaltantes.toFixed(1)} % de los turnos cerrados.
                    </p>
                </div>

                <div className="rounded-xl bg-blanco p-6 shadow-sm">
                    <p className="text-sm font-medium text-petro/60">
                        Turnos con faltantes críticos al ingreso
                    </p>

                    <p
                        className={
                            turnosConFaltantesCriticos > 0
                                ? "mt-2 text-3xl font-bold text-coral"
                                : "mt-2 text-3xl font-bold text-verde"
                        }
                    >
                        {turnosConFaltantesCriticos}
                    </p>

                    <p className="mt-1 text-sm text-petro/50">
                        {porcentajeConFaltantesCriticos.toFixed(1)} % de los turnos cerrados.
                    </p>
                </div>
            </div>
        </section>
    );
};