import type {
    ControlInsumo,
    Turno,
} from "../../interfaces/Turno";

import { useMemo, useState } from "react";

import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type PaginationState,
    type SortingState,
} from "@tanstack/react-table";


import {
    obtenerColorEstado,
    obtenerTextoEstado,
    obtenerTextoHorario,
} from "../../utils/turno";

interface HistorialTurnoProps {
    turno: Turno;
    onCerrar: () => void;
}

const columnasInsumos: ColumnDef<ControlInsumo>[] = [
    {
        accessorKey: "nombre",
        header: "Insumo",

        sortingFn: (rowA, rowB) =>
            rowA.original.nombre.localeCompare(
                rowB.original.nombre,
                "es",
                {
                    sensitivity: "base",
                },
            ),
    },
    {
        accessorKey: "categoria",
        header: "Categoría",

        sortingFn: (rowA, rowB) =>
            rowA.original.categoria.localeCompare(
                rowB.original.categoria,
                "es",
                {
                    sensitivity: "base",
                },
            ),

        cell: ({ row }) => (
            <span
                className="inline-block rounded-full border px-2 py-1 text-xs font-semibold"
                style={{
                    borderColor:
                        row.original.colorCategoria,
                    color:
                        row.original.colorCategoria,
                    backgroundColor:
                        `${row.original.colorCategoria}15`,
                }}
            >
                {row.original.categoria}
            </span>
        ),
    },
    {
        id: "consumido",

        accessorFn: (control) =>
            control.cantidadUsada ?? 0,

        header: "Consumido",

        cell: ({ row }) => {
            const cantidad =
                row.original.cantidadUsada ?? 0;

            if (cantidad <= 0) {
                return "-";
            }

            return (
                <span>
                    {cantidad}{" "}
                    {row.original.esOxigeno
                        ? "bar"
                        : "unidades"}
                </span>
            );
        },
    },
    {
        accessorKey: "cantidadRestockeo",
        header: "Restockeado",

        cell: ({ row }) =>
            row.original.cantidadRestockeo > 0
                ? `${row.original.cantidadRestockeo} ${row.original.esOxigeno
                    ? "bar"
                    : "unidades"
                }`
                : "-",
    },
    {
        accessorKey: "ingresoFaltante",
        header: "Faltante ingreso",

        cell: ({ row }) =>
            row.original.ingresoFaltante > 0 ? (
                <span className="font-semibold text-coral">
                    {row.original.ingresoFaltante}{" "}
                    {row.original.esOxigeno
                        ? "bar"
                        : "unidades"}
                </span>
            ) : (
                "-"
            ),
    },
];

export default function HistorialTurno({
    turno,
    onCerrar,
}: HistorialTurnoProps) {
    const insumosConActividad = useMemo(
        () =>
            turno.controlInsumos.filter(
                (control) =>
                    (control.cantidadUsada ?? 0) > 0 ||
                    control.cantidadRestockeo > 0 ||
                    control.ingresoFaltante > 0,
            ),
        [turno.controlInsumos],
    );

    const insumosFaltantesIngreso = useMemo(
        () =>
            turno.controlInsumos.filter(
                (control) =>
                    control.ingresoFaltante > 0,
            ),
        [turno.controlInsumos],
    );


    const [sorting, setSorting] =
        useState<SortingState>([]);

    const [globalFilter, setGlobalFilter] =
        useState("");

    const [pagination, setPagination] =
        useState<PaginationState>({
            pageIndex: 0,
            pageSize: 10,
        });

    const table = useReactTable({
        data: insumosConActividad,
        columns: columnasInsumos,

        state: {
            sorting,
            globalFilter,
            pagination,
        },

        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,

        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });



    return (
        <section className="rounded-xl bg-blanco p-6 shadow-sm">
            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-petro">
                        Historial del turno #{turno.id}
                    </h2>

                    <div className="mt-2 flex items-center gap-3">
                        <span
                            className={`rounded-md px-2 py-1 text-xs font-semibold ${obtenerColorEstado(
                                turno.estado,
                            )}`}
                        >
                            {obtenerTextoEstado(turno.estado)}
                        </span>

                        <span className="text-lg font-bold text-petro">
                            Ambulancia {turno.ambulancia.patente}
                        </span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onCerrar}
                    className="rounded-lg border border-petro/20 px-3 py-2 text-sm font-semibold text-petro transition hover:bg-petro/5"
                >
                    Cerrar
                </button>
            </div>

            <div className="grid gap-4 rounded-xl bg-petro/5 p-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                    <p className="text-xs text-petro/60">
                        Fecha
                    </p>
                    <p className="font-semibold text-petro">
                        {turno.fecha}
                    </p>
                </div>

                <div>
                    <p className="text-xs text-petro/60">
                        Horario
                    </p>
                    <p className="font-semibold text-petro">
                        {obtenerTextoHorario(turno.horario)}
                    </p>
                </div>

                <div>
                    <p className="text-xs text-petro/60">
                        Administrador
                    </p>
                    <p className="font-semibold text-petro">
                        {turno.admin.email}
                    </p>
                </div>

                <div>
                    <p className="text-xs text-petro/60">
                        Enfermero
                    </p>
                    <p className="font-semibold text-petro">
                        {turno.enfermero.email}
                    </p>
                </div>

                <div>
                    <p className="text-xs text-petro/60">
                        Médico
                    </p>
                    <p className="font-semibold text-petro">
                        {turno.medico}
                    </p>
                </div>

                <div>
                    <p className="text-xs text-petro/60">
                        Chofer
                    </p>
                    <p className="font-semibold text-petro">
                        {turno.chofer}
                    </p>
                </div>
            </div>

            <div className="mt-6">
                <h3 className="text-lg font-semibold text-petro">
                    Observaciones
                </h3>

                {turno.estado === "CANCELADO" ? (
                    <div className="mt-3 rounded-lg border border-coral/20 bg-coral/5 p-4">
                        <p className="text-xs font-semibold text-coral">
                            Motivo de cancelación
                        </p>

                        <p className="mt-1 text-sm text-petro">
                            {turno.observacionesEgreso ||
                                "Sin motivo registrado"}
                        </p>
                    </div>
                ) : (
                    <div className="mt-3 grid gap-4 md:grid-cols-2">
                        <div className="rounded-lg bg-petro/5 p-4">
                            <p className="text-xs text-petro/60">
                                Ingreso
                            </p>

                            <p className="mt-1 text-sm text-petro">
                                {turno.observacionesIngreso ||
                                    "Sin observaciones"}
                            </p>
                        </div>

                        <div className="rounded-lg bg-petro/5 p-4">
                            <p className="text-xs text-petro/60">
                                Egreso
                            </p>

                            <p className="mt-1 text-sm text-petro">
                                {turno.estado === "EN_CURSO"
                                    ? "Pendiente - El turno se encuentra en curso"
                                    : turno.observacionesEgreso ||
                                    "Sin observaciones"}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {turno.estado === "EN_CURSO" && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-petro">
                        Faltantes detectados al ingreso
                    </h3>

                    <p className="mt-1 text-sm text-petro/60">
                        Insumos que estaban por debajo del punto de control al iniciar el turno.
                    </p>

                    {insumosFaltantesIngreso.length === 0 ? (
                        <p className="mt-3 rounded-lg bg-petro/5 p-4 text-sm text-petro/60">
                            No se registraron faltantes al ingreso.
                        </p>
                    ) : (
                        <div className="mt-3 overflow-hidden rounded-lg border border-petro/10">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse text-left">
                                    <thead className="bg-petro/5">
                                        <tr>
                                            <th className="px-4 py-3 text-sm font-semibold whitespace-nowrap text-petro">
                                                Insumo
                                            </th>

                                            <th className="px-4 py-3 text-sm font-semibold whitespace-nowrap text-petro">
                                                Categoría
                                            </th>

                                            <th className="px-4 py-3 text-sm font-semibold whitespace-nowrap text-petro">
                                                Faltante
                                            </th>

                                            <th className="px-4 py-3 text-sm font-semibold whitespace-nowrap text-petro">
                                                Prioridad
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {insumosFaltantesIngreso.map((insumo) => (
                                            <tr
                                                key={insumo.insumoId}
                                                className="border-t border-petro/10"
                                            >
                                                <td className="px-4 py-3 text-sm font-medium text-petro">
                                                    {insumo.nombre}
                                                </td>

                                                <td className="px-4 py-3 text-sm text-petro">
                                                    <span
                                                        className="inline-block rounded-full border px-2 py-1 text-xs font-semibold"
                                                        style={{
                                                            borderColor:
                                                                insumo.colorCategoria,
                                                            color:
                                                                insumo.colorCategoria,
                                                            backgroundColor:
                                                                `${insumo.colorCategoria}15`,
                                                        }}
                                                    >
                                                        {insumo.categoria}
                                                    </span>
                                                </td>

                                                <td className="px-4 py-3 text-sm">
                                                    <span className="font-semibold text-coral">
                                                        {insumo.ingresoFaltante}{" "}
                                                        {insumo.esOxigeno
                                                            ? "bar"
                                                            : "unidades"}
                                                    </span>
                                                </td>

                                                <td className="px-4 py-3 text-sm">
                                                    {insumo.esCritico ? (
                                                        <span className="rounded-md bg-coral/10 px-2 py-1 text-xs font-semibold text-coral">
                                                            Crítico
                                                        </span>
                                                    ) : (
                                                        <span className="rounded-md bg-verde/10 px-2 py-1 text-xs font-semibold text-verde">
                                                            Normal
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {turno.estado === "FINALIZADO" && (
                <div className="mt-6">
                    <h3 className="mb-3 text-lg font-semibold text-petro">
                        Novedades de insumos
                    </h3>

                    {insumosConActividad.length > 0 && (
                        <div className="mb-4">
                            <label
                                htmlFor="buscar-novedades-insumos"
                                className="sr-only"
                            >
                                Buscar novedades de insumos
                            </label>

                            <input
                                id="buscar-novedades-insumos"
                                type="search"
                                value={globalFilter}
                                onChange={(event) =>
                                    setGlobalFilter(event.target.value)
                                }
                                placeholder="Buscar por insumo o categoría..."
                                className="w-full max-w-md rounded-lg border border-petro/20 bg-blanco px-3 py-2 text-sm text-petro outline-none transition focus:border-turquesa focus:ring-2 focus:ring-turquesa/20"
                            />
                        </div>
                    )}

                    {insumosConActividad.length === 0 ? (
                        <p className="rounded-lg bg-petro/5 p-4 text-sm text-petro/60">
                            Sin novedades de insumos durante el turno.
                        </p>
                    ) : (
                        <div className="overflow-hidden rounded-lg border border-petro/10">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse text-left">
                                    <thead className="bg-petro/5">
                                        {table.getHeaderGroups().map(
                                            (headerGroup) => (
                                                <tr key={headerGroup.id}>
                                                    {headerGroup.headers.map(
                                                        (header) => {
                                                            const orden =
                                                                header.column.getIsSorted();

                                                            return (
                                                                <th
                                                                    key={header.id}
                                                                    className="px-4 py-3 text-sm font-semibold whitespace-nowrap text-petro"
                                                                >
                                                                    <button
                                                                        type="button"
                                                                        onClick={
                                                                            header.column.getToggleSortingHandler()
                                                                        }
                                                                        className="inline-flex items-center gap-1"
                                                                    >
                                                                        {flexRender(
                                                                            header.column
                                                                                .columnDef
                                                                                .header,
                                                                            header.getContext(),
                                                                        )}

                                                                        {orden === "asc" &&
                                                                            " ↑"}

                                                                        {orden === "desc" &&
                                                                            " ↓"}
                                                                    </button>
                                                                </th>
                                                            );
                                                        },
                                                    )}
                                                </tr>
                                            ),
                                        )}
                                    </thead>

                                    <tbody>
                                        {table.getRowModel().rows.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={columnasInsumos.length}
                                                    className="px-4 py-8 text-center text-sm text-petro/60"
                                                >
                                                    No se encontraron novedades.
                                                </td>
                                            </tr>
                                        ) : (
                                            table.getRowModel().rows.map((row) => (
                                                <tr
                                                    key={row.id}
                                                    className="border-t border-petro/10"
                                                >
                                                    {row
                                                        .getVisibleCells()
                                                        .map((cell) => (
                                                            <td
                                                                key={cell.id}
                                                                className="px-4 py-3 text-sm text-petro"
                                                            >
                                                                {flexRender(
                                                                    cell.column.columnDef
                                                                        .cell,
                                                                    cell.getContext(),
                                                                )}
                                                            </td>
                                                        ))}
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex flex-col gap-3 border-t border-petro/10 bg-petro/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-sm text-petro/60">
                                    Página{" "}
                                    {table.getState().pagination.pageIndex + 1} de{" "}
                                    {table.getPageCount() || 1}
                                </p>

                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => table.previousPage()}
                                        disabled={!table.getCanPreviousPage()}
                                        className="rounded-lg border border-petro/20 bg-blanco px-3 py-2 text-sm font-semibold text-petro disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        Anterior
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => table.nextPage()}
                                        disabled={!table.getCanNextPage()}
                                        className="rounded-lg border border-petro/20 bg-blanco px-3 py-2 text-sm font-semibold text-petro disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            )}
        </section>
    );
}