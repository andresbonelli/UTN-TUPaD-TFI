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

import { useUsuarios } from "../hooks/useUsuarios";

import type { Usuario } from "../interfaces/Usuario";

const columnas: ColumnDef<Usuario>[] = [
    { accessorKey: "nombre", header: "Nombre", 
        // Orden alfabetico
        sortingFn: (rowA, rowB) =>
        rowA.original.nombre.localeCompare(
            rowB.original.nombre,
            "es",
            {
                sensitivity: "base",
            }
        ),
    },
    { accessorKey: "dni", header: "DNI", },
    { accessorKey: "email", header: "Email", },
    { accessorKey: "rol", header: "Rol",

        cell: ({ row }) => {
            const rol = row.original.rol;

            return (
                <span
                    className={
                        rol === "ADMINISTRADOR"
                            ? "rounded-md bg-ambar/10 px-2 py-1 text-xs font-semibold text-ambar"
                            : "rounded-md bg-azul/10 px-2 py-1 text-xs font-semibold text-azul"
                    }
                >
                    {rol}
                </span>
            );
        },
    },
    {
        accessorKey: "activo",
        header: "Estado",

        cell: ({ row }) => {
            const activo = row.original.activo;

            return (
                <span
                    className={
                        activo
                            ? "rounded-md bg-verde/10 px-2 py-1 text-xs font-semibold text-verde"
                            : "rounded-md bg-coral/10 px-2 py-1 text-xs font-semibold text-coral"
                    }
                >
                    {activo ? "Activo" : "Inactivo"}
                </span>
            );
        },
    },
];

const sinUsuarios: Usuario[] = [];

export default function AdminUsuarios() {
    const [sorting, setSorting] = useState<SortingState>([]);

    const [globalFilter, setGlobalFilter] = useState("");

    const [pagination, setPagination] = useState<PaginationState>({pageIndex: 0,pageSize: 5,});

    const {
        data: usuarios = sinUsuarios,
        isLoading,
        isError,
        error,
    } = useUsuarios();

    const table = useReactTable({
        data: usuarios,
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
                <p className="text-petro/60">Cargando usuarios...</p>
            </section>
        );
    }

    if (isError) {
        return (
            <section className="rounded-xl border border-coral/30 bg-coral/5 p-6">
                <p className="font-semibold text-coral">
                    No se pudieron cargar los usuarios.
                </p>

                <p className="mt-1 text-sm text-petro/60">{error.message}</p>
            </section>
        );
    }

    return (
        <section className="text-petro">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Usuarios</h1>

                <p className="mt-2 text-sm text-petro/60">
                    Usuarios registrados en Control107.
                </p>
            </div>

            <div className="mb-4">
                <label htmlFor="buscar-usuarios" className="sr-only">
                    Buscar usuarios
                </label>

                <input
                    id="buscar-usuarios"
                    type="search"
                    value={globalFilter}
                    onChange={(event) => setGlobalFilter(event.target.value)}
                    placeholder="Buscar por nombre, DNI, email o rol..."
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
                                        No se encontraron usuarios.
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
                        Página {table.getState().pagination.pageIndex + 1} de{" "}
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
        </section>
    );
}
