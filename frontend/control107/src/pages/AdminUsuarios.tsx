import { useEffect, useRef, useState } from "react";

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
    useActualizarUsuario,
    useCrearUsuario,
    useUsuarios,
    useEliminarUsuario,
} from "../hooks/useUsuarios";

import { useTurnos } from "../hooks/useTurnos";

import UsuarioForm from "../components/UsuarioForm";

import MensajeConfirmacion from "../components/MensajeConfirmacion";

import { useAuthStore } from "../stores/authStore";

import type {
    ActualizarUsuarioRequest,
    Usuario,
    UsuarioRequest,
} from "../interfaces/Usuario";

import { obtenerMensajeError } from "../utils/error";

const columnas: ColumnDef<Usuario>[] = [
    {
        accessorKey: "nombre",
        header: "Nombre",
        // Orden alfabetico
        sortingFn: (rowA, rowB) =>
            rowA.original.nombre.localeCompare(rowB.original.nombre, "es", {
                sensitivity: "base",
            }),
    },
    { accessorKey: "dni", header: "DNI" },
    { accessorKey: "email", header: "Email" },
    {
        accessorKey: "rol",
        header: "Rol",

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

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 5,
    });

    const {
        data: usuarios = sinUsuarios,
        isLoading,
        isError,
        error,
    } = useUsuarios();

    const crearUsuarioMutation = useCrearUsuario();

    const actualizarUsuarioMutation = useActualizarUsuario();

    const { data: turnos = [] } = useTurnos();

    const usuarioAutenticado = useAuthStore(
        (state) => state.usuario,
    );


    function handleCrearUsuario(
        usuario: UsuarioRequest | ActualizarUsuarioRequest,
    ) {
        if (!("clave" in usuario)) {
            return;
        }

        crearUsuarioMutation.mutate(usuario, {
            onSuccess: () => {
                setMensajeCreacion(
                    "Usuario creado correctamente.",
                );
            },
        });
    }

    function usuarioTieneTurnoAbierto(usuario: Usuario) {
        if (usuario.rol !== "ENFERMERO") {
            return false;
        }

        return turnos.some(
            (turno) =>
                turno.enfermero.id === usuario.id &&
                (
                    turno.estado === "PROGRAMADO" ||
                    turno.estado === "EN_CURSO"
                ),
        );
    }

    function handleActualizarUsuario(
        usuario: UsuarioRequest | ActualizarUsuarioRequest,
    ) {
        if (!usuarioEditando) {
            return;
        }

        const request: ActualizarUsuarioRequest = {
            nombre: usuario.nombre,
            dni: usuario.dni,
            email: usuario.email,
            rol: usuario.rol,
            activo: usuario.activo,
        };

        actualizarUsuarioMutation.mutate(
            {
                id: usuarioEditando.id,
                usuario: request,
            },
            {
                onSuccess: () => {
                    setMensajeEdicion(
                        "Usuario actualizado correctamente.",
                    );
                },
            },
        );
    }

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

    const [mensajeCreacion, setMensajeCreacion] = useState<string | null>(null);

    const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);

    useEffect(() => {
        if (usuarioEditando) {
            editarRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }, [usuarioEditando]);

    const [mensajeEdicion, setMensajeEdicion] = useState<string | null>(null);

    const [usuarioEliminandoId, setUsuarioEliminandoId] = useState<number | null>(null);

    const eliminarUsuarioMutation = useEliminarUsuario();

    const [mensajeEliminacion, setMensajeEliminacion] = useState<string | null>(null);

    function handleEliminarUsuario(id: number) {
        eliminarUsuarioMutation.mutate(
            id,
            {
                onSuccess: () => {
                    setUsuarioEliminandoId(null);
                    setUsuarioEditando(null);

                    setMensajeEliminacion(
                        "Usuario eliminado correctamente.",
                    );
                },
            },
        );
    }

    const editarRef = useRef<HTMLDivElement>(null);

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

            {mensajeCreacion && (
                <div className="mb-4">
                    <MensajeConfirmacion
                        mensaje={mensajeCreacion}
                        onCerrar={() => setMensajeCreacion(null)}
                    />
                </div>
            )}

            <div className="mb-6 rounded-xl bg-blanco p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold text-petro">Nuevo usuario</h2>

                <UsuarioForm
                    onSubmit={handleCrearUsuario}
                    isPending={crearUsuarioMutation.isPending}
                />

                {crearUsuarioMutation.isError && (
                    <div className="mt-4 rounded-lg border border-coral/30 bg-coral/5 p-3">
                        <p className="text-sm font-semibold text-coral">
                            {obtenerMensajeError(crearUsuarioMutation.error)}
                        </p>
                    </div>
                )}
            </div>

            {/* Divisor Administracion de usuarios */}

            <div className="my-8 border-t border-petro/10" />

            {mensajeEliminacion && (
                <div className="mb-4">
                    <MensajeConfirmacion
                        mensaje={mensajeEliminacion}
                        onCerrar={() =>
                            setMensajeEliminacion(null)
                        }
                    />
                </div>
            )}

            <div className="mb-4">
                <h2 className="text-xl font-semibold text-petro">
                    Administrar usuarios
                </h2>

                <p className="mt-1 text-sm text-petro/60">
                    Consulta y administra los usuarios registrados.
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

                                    <th className="border-b border-petro/10 px-4 py-3 text-sm font-semibold text-petro">
                                        Acciones
                                    </th>

                                </tr>
                            ))}
                        </thead>

                        <tbody>
                            {table.getRowModel().rows.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={columnas.length + 1}
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
                                        <td className="px-4 py-4 text-sm">
                                            {usuarioTieneTurnoAbierto(row.original) ? (
                                                <span className="rounded-md bg-petro/10 px-2 py-1 text-xs font-semibold text-petro/60">
                                                    Turno abierto
                                                </span>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setMensajeEdicion(null);
                                                        setUsuarioEliminandoId(null);

                                                        eliminarUsuarioMutation.reset();

                                                        setUsuarioEditando(row.original);
                                                    }}
                                                    className="rounded-lg border border-turquesa/30 px-3 py-2 text-sm font-semibold text-turquesa transition hover:bg-turquesa/10"
                                                >
                                                    Editar
                                                </button>
                                            )}
                                        </td>
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

            {usuarioEditando && (
                <>
                    <div className="my-8 border-t border-petro/10" />

                    <div
                        ref={editarRef}
                        className="rounded-xl bg-blanco p-6 shadow-sm"
                    >
                        <div className="mb-4 flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold text-petro">
                                    Editar usuario
                                </h2>

                                <p className="mt-1 text-sm text-petro/60">
                                    Modificando{" "}
                                    <span className="font-semibold text-petro">
                                        {usuarioEditando.nombre}
                                    </span>
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setMensajeEdicion(null);
                                    setUsuarioEliminandoId(null);

                                    eliminarUsuarioMutation.reset();

                                    setUsuarioEditando(null);
                                }}
                                className="rounded-lg border border-petro/20 px-3 py-2 text-sm font-semibold text-petro transition hover:bg-petro/5"
                            >
                                Cerrar
                            </button>
                        </div>

                        {mensajeEdicion && (
                            <div className="mb-4">
                                <MensajeConfirmacion
                                    mensaje={mensajeEdicion}
                                    onCerrar={() =>
                                        setMensajeEdicion(null)
                                    }
                                />
                            </div>
                        )}

                        <UsuarioForm
                            key={usuarioEditando.id}
                            valoresIniciales={{
                                nombre: usuarioEditando.nombre,
                                dni: usuarioEditando.dni,
                                email: usuarioEditando.email,
                                rol: usuarioEditando.rol,
                                activo: usuarioEditando.activo,
                            }}
                            textoBoton="Guardar cambios"
                            isPending={
                                actualizarUsuarioMutation.isPending
                            }
                            onSubmit={handleActualizarUsuario}
                        />

                        {actualizarUsuarioMutation.isError && (
                            <div className="mt-4 rounded-lg border border-coral/30 bg-coral/5 p-3">
                                <p className="text-sm font-semibold text-coral">
                                    {obtenerMensajeError(
                                        actualizarUsuarioMutation.error,
                                    )}
                                </p>
                            </div>
                        )}
                        <div className="mt-6 border-t border-petro/10 pt-4">
                            {usuarioEliminandoId === usuarioEditando.id ? (
                                <div className="flex flex-col items-start gap-3">
                                    <div>
                                        <p className="text-sm font-semibold text-coral">
                                            ¿Eliminar este usuario?
                                        </p>

                                        <p className="mt-1 text-xs text-petro/60">
                                            El usuario dejará de estar disponible en el sistema.
                                        </p>
                                    </div>

                                    {eliminarUsuarioMutation.isError && (
                                        <div className="w-full rounded-lg border border-coral/30 bg-coral/5 p-3">
                                            <p className="text-sm font-semibold text-coral">
                                                {obtenerMensajeError(
                                                    eliminarUsuarioMutation.error,
                                                )}
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setUsuarioEliminandoId(null);
                                                eliminarUsuarioMutation.reset();
                                            }}
                                            disabled={
                                                eliminarUsuarioMutation.isPending
                                            }
                                            className="rounded-lg border border-petro/20 px-3 py-2 text-sm font-semibold text-petro transition hover:bg-petro/5 disabled:opacity-50"
                                        >
                                            Cancelar
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleEliminarUsuario(
                                                    usuarioEditando.id,
                                                )
                                            }
                                            disabled={
                                                eliminarUsuarioMutation.isPending
                                            }
                                            className="rounded-lg bg-coral px-3 py-2 text-sm font-semibold text-blanco transition disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {eliminarUsuarioMutation.isPending
                                                ? "Eliminando..."
                                                : "Confirmar eliminación"}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                usuarioAutenticado?.id !== usuarioEditando.id && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setUsuarioEliminandoId(
                                                usuarioEditando.id,
                                            )
                                        }
                                        className="text-sm font-semibold text-coral transition hover:text-coral/70"
                                    >
                                        Eliminar usuario
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                </>
            )}

        </section>
    );
}
