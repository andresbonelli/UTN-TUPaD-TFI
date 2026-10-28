import { useState } from "react";

import {
    useActualizarCategoria,
    useCategorias,
    useCrearCategoria,
} from "../hooks/useCategorias";

import CategoriaForm from "../components/CategoriaForm";

import type { Categoria, CategoriaRequest } from "../interfaces/Categoria";

import { obtenerMensajeError } from "../utils/error";

export default function AdminCategorias() {
    const { data: categorias, isLoading, isError, error } = useCategorias();

    const crearCategoriaMutation = useCrearCategoria();

    const actualizarCategoriaMutation = useActualizarCategoria();

    const [categoriaEditando, setCategoriaEditando] = useState<Categoria | null>(
        null,
    );

    function handleCrearCategoria(categoria: CategoriaRequest) {
        crearCategoriaMutation.mutate(categoria);
    }

    function handleActualizarCategoria(categoria: CategoriaRequest) {
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
                },
            },
        );
    }

    if (isLoading) {
        return (
            <section>
                <p className="text-petro/60">Cargando categorías...</p>
            </section>
        );
    }

    if (isError) {
        return (
            <section className="rounded-xl border border-coral/30 bg-coral/5 p-6">
                <p className="font-semibold text-coral">
                    Error al cargar las categorías.
                </p>

                <p className="mt-1 text-sm text-petro/60">{error.message}</p>
            </section>
        );
    }

    return (
        <section className="text-petro">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Categorías</h1>
            </div>

            <div className="mb-6 rounded-lg border border-ambar/40 bg-ambar/10 p-4">
                <p className="text-sm font-semibold text-petro">Recordatorio</p>

                <p className="mt-1 text-sm text-petro/70">
                    Cualquier modificación de la colorimetría debe ser previamente
                    aprobada, ya que los colores definidos para cada categoría se
                    corresponden con la identificación visual de los insumos en las
                    ambulancias.
                </p>
            </div>

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
                />

                {/* mensaje de error del backend */}
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

            <div className="rounded-xl bg-blanco p-6 shadow-sm">
                {!categorias || categorias.length === 0 ? (
                    <p className="text-sm text-petro/60">
                        No hay categorías registradas.
                    </p>
                ) : (
                    <ul className="space-y-3">
                        {categorias.map((categoria) => (
                            <li
                                key={categoria.id}
                                className="rounded-lg border border-petro/10"
                            >
                                <div className="flex items-center justify-between gap-4 p-4">
                                    <div className="flex items-center gap-3">
                                        <span
                                            className="h-5 w-5 shrink-0 rounded-full"
                                            style={{
                                                backgroundColor: categoria.color,
                                            }}
                                        />

                                        <span className="font-medium">{categoria.nombre}</span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-petro/60">
                                            {categoria.color}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setCategoriaEditando(
                                                    categoriaEditando?.id === categoria.id
                                                        ? null
                                                        : categoria,
                                                )
                                            }
                                            className="rounded-lg border border-turquesa/30 px-3 py-2 text-sm font-semibold text-turquesa transition hover:bg-turquesa/10"
                                        >
                                            {categoriaEditando?.id === categoria.id
                                                ? "Cerrar"
                                                : "Editar"}
                                        </button>
                                    </div>
                                </div>

                                {categoriaEditando?.id === categoria.id && (
                                    //div de editar categoria
                                    <div className="border-t border-petro/10 bg-petro/5 p-4">
                                        <div className="mb-4">
                                            <h3 className="font-semibold text-petro">
                                                Editar categoría
                                            </h3>

                                            <p className="mt-1 text-sm text-petro/60">
                                                Modifica el nombre o el color de esta categoría.
                                            </p>
                                        </div>

                                        <CategoriaForm
                                            key={categoria.id}
                                            valoresIniciales={{
                                                nombre: categoria.nombre,
                                                color: categoria.color,
                                            }}
                                            textoBoton={
                                                actualizarCategoriaMutation.isPending
                                                    ? "Guardando..."
                                                    : "Guardar cambios"
                                            }
                                            onSubmit={handleActualizarCategoria}
                                        />

                                        {/* Mensaje de error del backend */}
                                        {actualizarCategoriaMutation.isError && (
                                            <div className="mt-4 rounded-lg border border-coral/30 bg-coral/5 p-3">
                                                <p className="text-sm font-semibold text-coral">
                                                    {obtenerMensajeError(
                                                        actualizarCategoriaMutation.error
                                                    )}
                                                </p>
                                            </div>
                                        )}

                                        <button
                                            type="button"
                                            onClick={() => setCategoriaEditando(null)}
                                            className="mt-3 text-sm font-semibold text-petro/60 transition hover:text-petro"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}
