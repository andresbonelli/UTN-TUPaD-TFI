import { useState } from "react";

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

import { useTurnos } from "../hooks/useTurnos";

import type { Turno } from "../interfaces/Turno";

import {
    obtenerColorEstado,
    obtenerTextoEstado,
    obtenerTextoHorario,
} from "../utils/turno";

const columnas: ColumnDef<Turno>[] = [
    {
        accessorKey: "fecha",
        header: "Fecha",

        cell: ({ row }) => (
            <span>
                {row.original.fecha}
            </span>
        ),
    },
    {
        id: "horario",

        accessorFn: (turno) =>
            obtenerTextoHorario(turno.horario),

        header: "Horario",

        sortingFn: (rowA, rowB) =>
            obtenerTextoHorario(
                rowA.original.horario
            ).localeCompare(
                obtenerTextoHorario(
                    rowB.original.horario
                ),
                "es",
                {
                    sensitivity: "base",
                }
            ),

        cell: ({ row }) => (
            <span className="font-medium">
                {obtenerTextoHorario(
                    row.original.horario
                )}
            </span>
        ),
    },
    {
        id: "estado",

        accessorFn: (turno) =>
            obtenerTextoEstado(turno.estado),

        header: "Estado",

        sortingFn: (rowA, rowB) =>
            obtenerTextoEstado(
                rowA.original.estado
            ).localeCompare(
                obtenerTextoEstado(
                    rowB.original.estado
                ),
                "es",
                {
                    sensitivity: "base",
                }
            ),

        cell: ({ row }) => (
            <span
                className={`rounded-md px-2 py-1 text-xs font-semibold ${obtenerColorEstado(
                    row.original.estado
                )}`}
            >
                {obtenerTextoEstado(
                    row.original.estado
                )}
            </span>
        ),
    },
    {
        id: "enfermero",

        accessorFn: (turno) =>
            turno.enfermero.email,

        header: "Enfermero",

        sortingFn: (rowA, rowB) =>
            rowA.original.enfermero.email.localeCompare(
                rowB.original.enfermero.email,
                "es",
                {
                    sensitivity: "base",
                }
            ),

        cell: ({ row }) => (
            <span>
                {row.original.enfermero.email}
            </span>
        ),
    },
    {
        id: "ambulancia",

        accessorFn: (turno) =>
            turno.ambulancia.patente,

        header: "Ambulancia",

        sortingFn: (rowA, rowB) =>
            rowA.original.ambulancia.patente.localeCompare(
                rowB.original.ambulancia.patente,
                "es",
                {
                    sensitivity: "base",
                }
            ),

        cell: ({ row }) => (
            <span className="font-medium">
                {row.original.ambulancia.patente}
            </span>
        ),
    },
    {
        accessorKey: "medico",
        header: "Médico",

        sortingFn: (rowA, rowB) =>
            rowA.original.medico.localeCompare(
                rowB.original.medico,
                "es",
                {
                    sensitivity: "base",
                }
            ),
    },
    {
        accessorKey: "chofer",
        header: "Chofer",

        sortingFn: (rowA, rowB) =>
            rowA.original.chofer.localeCompare(
                rowB.original.chofer,
                "es",
                {
                    sensitivity: "base",
                }
            ),
    },
];

const sinTurnos: Turno[] = [];

export default function AdminTurnos() {
    const [sorting, setSorting] =
        useState<SortingState>([]);

    const [globalFilter, setGlobalFilter] =
        useState("");

    const [pagination, setPagination] =
        useState<PaginationState>({
            pageIndex: 0,
            pageSize: 5,
        });

    const {
        data: turnos = sinTurnos,
        isLoading,
        isError,
        error,
    } = useTurnos();

    const table = useReactTable({
        data: turnos,
        columns: columnas,

        state: {
            sorting,
            globalFilter,
            pagination,
        },

        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,

        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel:
            getFilteredRowModel(),
        getSortedRowModel:
            getSortedRowModel(),
        getPaginationRowModel:
            getPaginationRowModel(),
    });

    if (isLoading) {
        return (
            <section>
                <p className="text-petro/60">
                    Cargando turnos...
                </p>
            </section>
        );
    }

    if (isError) {
        return (
            <section className="rounded-xl border border-coral/30 bg-coral/5 p-6">
                <p className="font-semibold text-coral">
                    No se pudieron cargar los turnos.
                </p>

                <p className="mt-1 text-sm text-petro/60">
                    {error.message}
                </p>
            </section>
        );
    }

    return (
        <section className="text-petro">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">
                    Turnos
                </h1>

                <p className="mt-2 text-sm text-petro/60">
                    Consulta los turnos registrados en
                    Control107.
                </p>
            </div>

            <div className="mb-4">
                <label
                    htmlFor="buscar-turnos"
                    className="sr-only"
                >
                    Buscar turnos
                </label>

                <input
                    id="buscar-turnos"
                    type="search"
                    value={globalFilter}
                    onChange={(event) =>
                        setGlobalFilter(
                            event.target.value
                        )
                    }
                    placeholder="Buscar por fecha, estado, enfermero, ambulancia, médico o chofer..."
                    className="w-full max-w-xl rounded-lg border border-petro/20 bg-blanco px-3 py-2 text-sm text-petro outline-none transition focus:border-turquesa focus:ring-2 focus:ring-turquesa/20"
                />
            </div>

            <div className="overflow-hidden rounded-xl bg-blanco shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead className="bg-petro/5">
                            {table
                                .getHeaderGroups()
                                .map((headerGroup) => (
                                    <tr
                                        key={
                                            headerGroup.id
                                        }
                                    >
                                        {headerGroup.headers.map(
                                            (header) => {
                                                const orden =
                                                    header.column.getIsSorted();

                                                return (
                                                    <th
                                                        key={
                                                            header.id
                                                        }
                                                        className="border-b border-petro/10 px-4 py-3 text-sm font-semibold whitespace-nowrap text-petro"
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={
                                                                header.column.getToggleSortingHandler()
                                                            }
                                                            className="inline-flex items-center gap-1"
                                                        >
                                                            {flexRender(
                                                                header
                                                                    .column
                                                                    .columnDef
                                                                    .header,
                                                                header.getContext()
                                                            )}

                                                            {orden ===
                                                                "asc" &&
                                                                " ↑"}

                                                            {orden ===
                                                                "desc" &&
                                                                " ↓"}
                                                        </button>
                                                    </th>
                                                );
                                            }
                                        )}
                                    </tr>
                                ))}
                        </thead>

                        <tbody>
                            {table.getRowModel().rows
                                .length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={
                                            columnas.length
                                        }
                                        className="px-4 py-8 text-center text-sm text-petro/60"
                                    >
                                        No se encontraron turnos.
                                    </td>
                                </tr>
                            ) : (
                                table
                                    .getRowModel()
                                    .rows.map((row) => (
                                        <tr
                                            key={row.id}
                                            className="border-b border-petro/10 last:border-b-0 hover:bg-petro/5"
                                        >
                                            {row
                                                .getVisibleCells()
                                                .map(
                                                    (
                                                        cell
                                                    ) => (
                                                        <td
                                                            key={
                                                                cell.id
                                                            }
                                                            className="px-4 py-4 text-sm whitespace-nowrap"
                                                        >
                                                            {flexRender(
                                                                cell
                                                                    .column
                                                                    .columnDef
                                                                    .cell,
                                                                cell.getContext()
                                                            )}
                                                        </td>
                                                    )
                                                )}
                                        </tr>
                                    ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col gap-3 border-t border-petro/10 bg-petro/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-petro/60">
                        Página{" "}
                        {table.getState().pagination
                            .pageIndex + 1}{" "}
                        de {table.getPageCount() || 1}
                    </p>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() =>
                                table.previousPage()
                            }
                            disabled={
                                !table.getCanPreviousPage()
                            }
                            className="rounded-lg border border-petro/20 bg-blanco px-3 py-2 text-sm font-semibold text-petro disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Anterior
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                table.nextPage()
                            }
                            disabled={
                                !table.getCanNextPage()
                            }
                            className="rounded-lg border border-petro/20 bg-blanco px-3 py-2 text-sm font-semibold text-petro disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}