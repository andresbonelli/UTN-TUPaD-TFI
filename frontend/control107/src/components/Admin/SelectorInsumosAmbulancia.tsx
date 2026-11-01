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

import type { Insumo } from "../../interfaces/Insumo";

interface SelectorInsumosAmbulanciaProps {
    insumos: Insumo[];
    seleccionados: number[];
    onChange: (seleccionados: number[]) => void;
}

interface InsumoSeleccionable extends Insumo {
    seleccionado: boolean;
}

export default function SelectorInsumosAmbulancia({
    insumos,
    seleccionados,
    onChange,
}: SelectorInsumosAmbulanciaProps) {
    const [sorting, setSorting] =
        useState<SortingState>([]);

    const [globalFilter, setGlobalFilter] =
        useState("");

    const [pagination, setPagination] =
        useState<PaginationState>({
            pageIndex: 0,
            pageSize: 10,
        });

    const datos = useMemo<InsumoSeleccionable[]>(
        () =>
            insumos.map((insumo) => ({
                ...insumo,
                seleccionado: seleccionados.includes(
                    insumo.id,
                ),
            })),
        [insumos, seleccionados],
    );

    const columnas = useMemo<
        ColumnDef<InsumoSeleccionable>[]
    >(
        () => [
            {
                accessorKey: "seleccionado",
                header: "Agregar",

                sortingFn: (rowA, rowB) =>
                    Number(rowA.original.seleccionado) -
                    Number(rowB.original.seleccionado),

                cell: ({ row }) => {
                    const insumo = row.original;

                    return (
                        <input
                            type="checkbox"
                            checked={insumo.seleccionado}
                            onChange={(event) => {
                                if (event.target.checked) {
                                    onChange([
                                        ...seleccionados,
                                        insumo.id,
                                    ]);

                                    return;
                                }

                                onChange(
                                    seleccionados.filter(
                                        (id) =>
                                            id !== insumo.id,
                                    ),
                                );
                            }}
                            className="h-4 w-4 accent-turquesa"
                        />
                    );
                },
            },
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
            },
            {
                id: "prioridad",

                accessorFn: (insumo) =>
                    insumo.critico
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
        ],
        [onChange, seleccionados],
    );

const table = useReactTable({
    data: datos,
    columns: columnas,

    state: {
        sorting,
        globalFilter,
        pagination,
    },

    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,

    autoResetPageIndex: false,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
});

    return (
        <div className="flex flex-col gap-3">
            <input
                type="search"
                value={globalFilter}
                onChange={(event) =>
                    setGlobalFilter(event.target.value)
                }
                placeholder="Buscar por insumo, categoría o prioridad..."
                className="w-full max-w-md rounded-lg border border-petro/20 bg-blanco px-3 py-2 text-sm text-petro outline-none transition focus:border-turquesa focus:ring-2 focus:ring-turquesa/20"
            />

            <div className="overflow-hidden rounded-lg border border-petro/10">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead className="bg-petro/5">
                            {table
                                .getHeaderGroups()
                                .map((headerGroup) => (
                                    <tr
                                        key={headerGroup.id}
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
                                                                header
                                                                    .column
                                                                    .columnDef
                                                                    .header,
                                                                header.getContext(),
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
                                            },
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
                                        No se encontraron insumos.
                                    </td>
                                </tr>
                            ) : (
                                table
                                    .getRowModel()
                                    .rows.map((row) => (
                                        <tr
                                            key={row.id}
                                            className="border-t border-petro/10 hover:bg-petro/5"
                                        >
                                            {row
                                                .getVisibleCells()
                                                .map(
                                                    (
                                                        cell,
                                                    ) => (
                                                        <td
                                                            key={
                                                                cell.id
                                                            }
                                                            className="px-4 py-3 text-sm text-petro"
                                                        >
                                                            {flexRender(
                                                                cell
                                                                    .column
                                                                    .columnDef
                                                                    .cell,
                                                                cell.getContext(),
                                                            )}
                                                        </td>
                                                    ),
                                                )}
                                        </tr>
                                    ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col gap-3 border-t border-petro/10 bg-petro/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-petro/60">
                            Página{" "}
                            {table.getState().pagination
                                .pageIndex + 1}{" "}
                            de{" "}
                            {table.getPageCount() || 1}
                        </p>

                        <p className="mt-1 text-xs font-medium text-petro/60">
                            Seleccionados:{" "}
                            {seleccionados.length}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <label className="flex items-center gap-2 text-sm text-petro/60">
                            Mostrar

                            <select
                                value={
                                    table.getState()
                                        .pagination
                                        .pageSize
                                }
                                onChange={(event) =>
                                    table.setPageSize(
                                        Number(
                                            event.target
                                                .value,
                                        ),
                                    )
                                }
                                className="rounded-lg border border-petro/20 bg-blanco px-2 py-1 text-sm text-petro"
                            >
                                <option value={5}>
                                    5
                                </option>

                                <option value={10}>
                                    10
                                </option>

                                <option value={20}>
                                    20
                                </option>

                                <option value={50}>
                                    50
                                </option>
                            </select>
                        </label>

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
        </div>
    );
}