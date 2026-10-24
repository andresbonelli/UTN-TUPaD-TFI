import { useCategorias, useCrearCategoria } from "../hooks/useCategorias";

import CategoriaForm from "../components/CategoriaForm";
import type { CategoriaRequest } from "../interfaces/Categoria";

export default function AdminCategorias() {
    const { data: categorias, isLoading, isError, error } = useCategorias();

    const crearCategoriaMutation = useCrearCategoria();

    function handleCrearCategoria(categoria: CategoriaRequest) {
        crearCategoriaMutation.mutate(categoria);
    }


    if (isLoading) {
        return (
            <main className="p-6">
                <p>Cargando categorías...</p>
            </main>
        );
    }

    if (isError) {
        return (
            <main className="p-6">
                <p>Error al cargar las categorías.</p>
                <p>{error.message}</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-fondo p-6 text-petro">
            <div className="mx-auto max-w-5xl">
                <h1 className="mb-6 text-3xl font-bold">Categorías</h1>

                <div className="mb-6 rounded-xl bg-blanco p-6 shadow-sm">
                    <h2 className="mb-4 text-xl font-semibold text-petro">Nueva categoría</h2>

                    <CategoriaForm onSubmit={handleCrearCategoria} />
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
                                    className="flex items-center justify-between rounded-lg border border-petro/10 p-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <span
                                            className="h-5 w-5 rounded-full"
                                            style={{
                                                backgroundColor: categoria.color,
                                            }}
                                        />

                                        <span className="font-medium">
                                            {categoria.nombre}
                                        </span>
                                    </div>

                                    <span className="text-sm text-petro/60">
                                        {categoria.color}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

            </div>
        </main>
    );
}
