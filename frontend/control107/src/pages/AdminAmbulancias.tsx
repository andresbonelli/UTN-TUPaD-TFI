import { useState } from "react";

import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type SortingState,
    getPaginationRowModel,
    type PaginationState,
} from "@tanstack/react-table";

import { useAmbulancias } from "../hooks/useAmbulancia";

import type { Ambulancia } from "../interfaces/Ambulancia";

const columnas: ColumnDef<Ambulancia>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "patente",
        header: "Patente",

        sortingFn: (rowA, rowB) =>
            rowA.original.patente.localeCompare(rowB.original.patente, "es", {
                sensitivity: "base",
            }),
    },
];

const sinAmbulancias: Ambulancia[] = [];

export default function AdminAmbulancias() {
    const [sorting, setSorting] = useState<SortingState>([]);

    const [pagination, setPagination] =
    useState<PaginationState>({
        pageIndex: 0,
        pageSize: 5,
    });

    const [globalFilter, setGlobalFilter] = useState("");

    const {
        data: ambulancias = sinAmbulancias,
        isLoading,
        isError,
        error,
    } = useAmbulancias();

    const table = useReactTable({
        data: ambulancias,
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
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    if (isLoading) {
        return (
            <section>
                <p className="text-petro/60">Cargando ambulancias...</p>
            </section>
        );
    }

    if (isError) {
        return (
            <section className="rounded-xl border border-coral/30 bg-coral/5 p-6">
                <p className="font-semibold text-coral">
                    No se pudieron cargar las ambulancias.
                </p>

                <p className="mt-1 text-sm text-petro/60">{error.message}</p>
            </section>
        );
    }

    return (
        <section className="text-petro">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Ambulancias</h1>

                <p className="mt-2 text-sm text-petro/60">
                    Ambulancias registradas en Control107.
                </p>
            </div>

            <div className="mb-4">
                <label htmlFor="buscar-ambulancias" className="sr-only">
                    Buscar ambulancias
                </label>

                <input
                    id="buscar-ambulancias"
                    type="search"
                    value={globalFilter}
                    onChange={(event) => setGlobalFilter(event.target.value)}
                    placeholder="Buscar por ID o patente..."
                    className="w-full max-w-md rounded-lg border border-petro/20 bg-blanco px-3 py-2 text-sm text-petro outline-none transition focus:border-turquesa focus:ring-2 focus:ring-turquesa/20"
                />
            </div>

            <div className="overflow-hidden rounded-xl bg-blanco shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead className="bg-petro/5">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        const orden = header.column.getIsSorted();

                                        return (
                                            <th
                                                key={header.id}
                                                className="border-b border-petro/10 px-4 py-3 text-sm font-semibold text-petro"
                                            >
                                                <button
                                                    type="button"
                                                    onClick={header.column.getToggleSortingHandler()}
                                                    className="inline-flex items-center gap-1"
                                                >
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext(),
                                                    )}

                                                    {orden === "asc" && " ↑"}

                                                    {orden === "desc" && " ↓"}
                                                </button>
                                            </th>
                                        );
                                    })}
                                </tr>
                            ))}
                        </thead>

                        <tbody>
                            {table.getRowModel().rows.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={columnas.length}
                                        className="px-4 py-8 text-center text-sm text-petro/60"
                                    >
                                        No se encontraron ambulancias.
                                    </td>
                                </tr>
                            ) : (
                                table.getRowModel().rows.map((row) => (
                                    <tr
                                        key={row.id}
                                        className="border-b border-petro/10 last:border-b-0 hover:bg-petro/5"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <td key={cell.id} className="px-4 py-4 text-sm">
                                                {flexRender(
                                                    cell.column.columnDef.cell,
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
                        {table.getState().pagination.pageIndex + 1}{" "}
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
