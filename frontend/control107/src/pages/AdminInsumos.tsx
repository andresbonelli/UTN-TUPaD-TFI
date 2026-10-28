import {
    useState,
} from "react";

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
    useCrearInsumo,
    useInsumos,
} from "../hooks/useInsumos";

import InsumoForm from "../components/InsumoForm";

import CategoriaBadge from "../components/CategoriaBadge";


import { obtenerMensajeError } from "../utils/error";

import type {
    Insumo,
    InsumoRequest,
} from "../interfaces/Insumo";

const columnas: ColumnDef<Insumo>[] = [
    {
        accessorKey: "nombre",
        header: "Nombre",

        sortingFn: (rowA, rowB) =>
            rowA.original.nombre.localeCompare(
                rowB.original.nombre,
                "es",
                {
                    sensitivity: "base",
                }
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
                }
            ),

        cell: ({ row }) => (
            <CategoriaBadge
                nombre={row.original.categoria}
            />
        ),
    },
    {
        accessorKey: "puntoControl",
        header: "Punto de control",
    },
    {
        id: "prioridad",

        accessorFn: (insumo) =>
            insumo.critico // true = critico | false = normal
                ? "Crítico"
                : "Normal",

        header: "Prioridad",

        cell: ({ row }) => (
            <span
                className={
                    row.original.critico
                        ? "rounded-md bg-coral/10 px-2 py-1 text-xs font-semibold text-coral"
                        : "rounded-md bg-verde/10 px-2 py-1 text-xs font-semibold text-verde"
                }
            >
                {row.original.critico
                    ? "Crítico"
                    : "Normal"}
            </span>
        ),
    },
];

const sinInsumos: Insumo[] = [];

export default function AdminInsumos() {
    const [sorting, setSorting] =
        useState<SortingState>([]);

    const [globalFilter, setGlobalFilter] =
        useState("");

    const [pagination, setPagination] =
        useState<PaginationState>({
            pageIndex: 0,
            pageSize: 10,
        });

    const {
        data: insumos = sinInsumos,
        isLoading,
        isError,
        error,
    } = useInsumos();

    const crearInsumoMutation =
        useCrearInsumo();

    function handleCrearInsumo(
        insumo: InsumoRequest
    ) {
        crearInsumoMutation.mutate(insumo);
    }

    const table = useReactTable({
        data: insumos,
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
                <p className="text-petro/60">
                    Cargando insumos...
                </p>
            </section>
        );
    }

    if (isError) {
        return (
            <section className="rounded-xl border border-coral/30 bg-coral/5 p-6">
                <p className="font-semibold text-coral">
                    No se pudieron cargar los insumos.
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
                    Insumos
                </h1>

                <p className="mt-2 text-sm text-petro/60">
                    Insumos registrados en Control107.
                </p>
            </div>

            {/* Seccion de nuevo insumo */}
            <div className="mb-6 rounded-xl bg-blanco p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold text-petro">
                    Nuevo insumo
                </h2>

                <InsumoForm
                    onSubmit={handleCrearInsumo}
                    isPending={crearInsumoMutation.isPending}
                />

                {/* mensaje de error del backend */}
                {crearInsumoMutation.isError && (
                    <div className="mt-4 rounded-lg border border-coral/30 bg-coral/5 p-3">
                        <p className="text-sm font-semibold text-coral">
                            {obtenerMensajeError(
                                crearInsumoMutation.error
                            )}
                        </p>
                    </div>
                )}

            </div>
            
            {/* divisor */}
            <div className="my-8 border-t border-petro/10" />

                <h3 className="mb-5 text-2xl font-bold">
                    Buscar / Editar Insumos
                </h3>

            <div className="mb-4">
                <label
                    htmlFor="buscar-insumos"
                    className="sr-only"
                >
                    Buscar insumos
                </label>

                <input
                    id="buscar-insumos"
                    type="search"
                    value={globalFilter}
                    onChange={(event) =>
                        setGlobalFilter(
                            event.target.value
                        )
                    }
                    placeholder="Buscar por nombre, categoría o prioridad..."
                    className="w-full max-w-md rounded-lg border border-petro/20 bg-blanco px-3 py-2 text-sm text-petro outline-none transition focus:border-turquesa focus:ring-2 focus:ring-turquesa/20"
                />
            </div>

            <div className="overflow-hidden rounded-xl bg-blanco shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead className="bg-petro/5">
                            {table
                                .getHeaderGroups()
                                .map((headerGroup) => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map(
                                            (header) => {
                                                const orden =
                                                    header.column.getIsSorted();

                                                return (
                                                    <th
                                                        key={header.id}
                                                        className="border-b border-petro/10 px-4 py-3 text-sm font-semibold text-petro"
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
                            {table.getRowModel().rows.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={columnas.length}
                                        className="px-4 py-8 text-center text-sm text-petro/60"
                                    >
                                        No se encontraron insumos.
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
                                                .map((cell) => (
                                                    <td
                                                        key={cell.id}
                                                        className="px-4 py-4 text-sm"
                                                    >
                                                        {flexRender(
                                                            cell.column
                                                                .columnDef
                                                                .cell,
                                                            cell.getContext()
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
                        {table.getState().pagination.pageIndex +
                            1}{" "}
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