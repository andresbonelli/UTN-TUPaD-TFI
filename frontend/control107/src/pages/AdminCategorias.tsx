import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    useActualizarCategoria,
    useCategorias,
    useCrearCategoria,
    useEliminarCategoria,
} from "../hooks/useCategorias";

import CategoriaForm from "../components/CategoriaForm";

import MensajeConfirmacion from "../components/MensajeConfirmacion";

import type {
    Categoria,
    CategoriaRequest,
} from "../interfaces/Categoria";

import { obtenerMensajeError } from "../utils/error";

export default function AdminCategorias() {
    const {
        data: categorias,
        isLoading,
        isError,
        error,
    } = useCategorias();

    const crearCategoriaMutation = useCrearCategoria();

    const actualizarCategoriaMutation = useActualizarCategoria();

    const eliminarCategoriaMutation = useEliminarCategoria();

    const [categoriaEliminandoId, setCategoriaEliminandoId] = useState<number | null>(null);

    const [mensajeCreacion, setMensajeCreacion] = useState<string | null>(null);

    const [mensajeActualizacion, setMensajeActualizacion] = useState<string | null>(null);

    const [mensajeEliminacion, setMensajeEliminacion] = useState<string | null>(null);

    const [categoriaEditando, setCategoriaEditando] = useState<Categoria | null>(null);

    const editarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (categoriaEditando) {
            editarRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }, [categoriaEditando]);


    function handleCrearCategoria(
        categoria: CategoriaRequest
    ) {
        crearCategoriaMutation.mutate(
            categoria,
            {
                onSuccess: () => {
                    setMensajeCreacion(
                        "Categoría creada correctamente."
                    );
                },
            }
        );
    }

    function handleActualizarCategoria(
        categoria: CategoriaRequest
    ) {
        if (!categoriaEditando) {
            return;
        }

        actualizarCategoriaMutation.mutate(
            {
                id: categoriaEditando.id,
                categoria,
            },
            {
                onSuccess: () => {
                    setCategoriaEditando(null);

                    setMensajeActualizacion(
                        "Categoría actualizada correctamente.",
                    );
                },
            }
        );
    }

    function handleEliminarCategoria(id: number) {
        eliminarCategoriaMutation.mutate(
            id,
            {
                onSuccess: () => {
                    setCategoriaEliminandoId(null);
                    setCategoriaEditando(null);

                    setMensajeEliminacion(
                        "Categoría eliminada correctamente."
                    );
                },
            }
        );
    }


    if (isLoading) {
        return (
            <section>
                <p className="text-petro/60">
                    Cargando categorías...
                </p>
            </section>
        );
    }

    if (isError) {
        return (
            <section className="rounded-xl border border-coral/30 bg-coral/5 p-6">
                <p className="font-semibold text-coral">
                    Error al cargar las categorías.
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
                    Categorías
                </h1>
            </div>

            <div className="mb-6 rounded-lg border border-ambar/40 bg-ambar/10 p-4">
                <p className="text-sm font-bold text-coral">
                    Recordatorio
                </p>

                <p className="mt-1 text-sm text-petro/70">
                    Cualquier categoría nueva o modificación de la colorimetría debe ser previamente
                    aprobada, ya que los colores definidos para cada categoría se corresponden con
                    la identificación visual de los insumos en las ambulancias.
                </p>
            </div>

            {mensajeCreacion && (
                <div className="mb-4">
                    <MensajeConfirmacion
                        mensaje={mensajeCreacion}
                        onCerrar={() =>
                            setMensajeCreacion(null)
                        }
                    />
                </div>
            )}

            {/* Crear Categorias  */}
            <div className="mb-6 rounded-xl bg-blanco p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold text-petro">
                    Nueva categoría
                </h2>

                <CategoriaForm
                    onSubmit={handleCrearCategoria}
                    textoBoton={
                        crearCategoriaMutation.isPending
                            ? "Guardando..."
                            : "Guardar categoría"
                    }
                    isPending={crearCategoriaMutation.isPending}
                />

                {crearCategoriaMutation.isError && (
                    <div className="mt-4 rounded-lg border border-coral/30 bg-coral/5 p-3">
                        <p className="text-sm font-semibold text-coral">
                            {obtenerMensajeError(
                                crearCategoriaMutation.error
                            )}
                        </p>
                    </div>
                )}
            </div>



            {/* Divisor */}
            <div className="my-8 border-t border-petro/10" />

            {mensajeActualizacion && (
                <div className="mb-4">
                    <MensajeConfirmacion
                        mensaje={mensajeActualizacion}
                        onCerrar={() =>
                            setMensajeActualizacion(null)
                        }
                    />
                </div>
            )}

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

            <h2 className="mb-4 text-xl font-semibold text-petro">Administrar categorías</h2>

            <div className="rounded-xl bg-blanco p-6 shadow-sm">

                {!categorias ||
                    categorias.length === 0 ? (
                    <p className="text-sm text-petro/60">
                        No hay categorías registradas.
                    </p>
                ) : (
                    <ul className="space-y-3">
                        {categorias.map(
                            (categoria) => (
                                <li
                                    key={categoria.id}
                                    className="flex items-center justify-between gap-4 rounded-lg border border-petro/10 p-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <span
                                            className="h-5 w-5 shrink-0 rounded-full"
                                            style={{
                                                backgroundColor:
                                                    categoria.color,
                                            }}
                                        />

                                        <span className="font-medium">
                                            {
                                                categoria.nombre
                                            }
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-petro/60">
                                            {
                                                categoria.color
                                            }
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setCategoriaEliminandoId(null);
                                                eliminarCategoriaMutation.reset();
                                                setCategoriaEditando(categoria);
                                            }}
                                            className="rounded-lg border border-turquesa/30 px-3 py-2 text-sm font-semibold text-turquesa transition hover:bg-turquesa/10"
                                        >
                                            Editar
                                        </button>
                                    </div>
                                </li>
                            )
                        )}
                    </ul>
                )}
            </div>

            {categoriaEditando && (
                <>
                    {/* Divisor - Editar categorias  */}
                    <div className="my-8 border-t border-petro/10" />

                    <div ref={editarRef} className="rounded-xl bg-blanco p-6 shadow-sm">
                        <div className="mb-4 flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold text-petro">
                                    Editar categoría
                                </h2>

                                <p className="mt-1 text-sm text-petro/60">
                                    Modificando{" "}
                                    <span className="font-semibold text-petro">
                                        {
                                            categoriaEditando.nombre
                                        }
                                    </span>
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setCategoriaEliminandoId(null);
                                    eliminarCategoriaMutation.reset();
                                    setCategoriaEditando(null);
                                }}
                                className="rounded-lg border border-petro/20 px-3 py-2 text-sm font-semibold text-petro transition hover:bg-petro/5"
                            >
                                Cerrar
                            </button>
                        </div>

                        <CategoriaForm
                            key={
                                categoriaEditando.id
                            }
                            valoresIniciales={{
                                nombre:
                                    categoriaEditando.nombre,
                                color:
                                    categoriaEditando.color,
                            }}
                            textoBoton={
                                actualizarCategoriaMutation.isPending
                                    ? "Guardando..."
                                    : "Guardar cambios"
                            }
                            isPending={actualizarCategoriaMutation.isPending}
                            onSubmit={handleActualizarCategoria}
                        />

                        {actualizarCategoriaMutation.isError && (
                            <div className="mt-4 rounded-lg border border-coral/30 bg-coral/5 p-3">
                                <p className="text-sm font-semibold text-coral">
                                    {obtenerMensajeError(
                                        actualizarCategoriaMutation.error
                                    )}
                                </p>
                            </div>
                        )}

                        <div className="mt-6 border-t border-petro/10 pt-4">
                            {categoriaEliminandoId === categoriaEditando.id ? (
                                <div className="flex flex-col items-start gap-3">
                                    <div>
                                        <p className="text-sm font-semibold text-coral">
                                            ¿Eliminar esta categoría?
                                        </p>

                                        <p className="mt-1 text-xs text-petro/60">
                                            La categoría dejará de estar disponible en el sistema.
                                        </p>
                                    </div>

                                    {eliminarCategoriaMutation.isError && (
                                        <div className="w-full rounded-lg border border-coral/30 bg-coral/5 p-3">
                                            <p className="text-sm font-semibold text-coral">
                                                {obtenerMensajeError(
                                                    eliminarCategoriaMutation.error
                                                )}
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setCategoriaEliminandoId(null);
                                                eliminarCategoriaMutation.reset();
                                            }}
                                            disabled={eliminarCategoriaMutation.isPending}
                                            className="rounded-lg border border-petro/20 px-3 py-2 text-sm font-semibold text-petro transition hover:bg-petro/5 disabled:opacity-50"
                                        >
                                            Cancelar
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleEliminarCategoria(
                                                    categoriaEditando.id
                                                )
                                            }
                                            disabled={eliminarCategoriaMutation.isPending}
                                            className="rounded-lg bg-coral px-3 py-2 text-sm font-semibold text-blanco transition disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {eliminarCategoriaMutation.isPending
                                                ? "Eliminando..."
                                                : "Confirmar eliminación"}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => {
                                        eliminarCategoriaMutation.reset();
                                        setCategoriaEliminandoId(
                                            categoriaEditando.id
                                        );
                                    }}
                                    className="text-sm font-semibold text-coral transition hover:text-coral/70"
                                >
                                    Eliminar categoría
                                </button>
                            )}
                        </div>
                    </div>
                </>
            )}
        </section>
    );
}