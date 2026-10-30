import { useForm } from "@tanstack/react-form";

import { useCategorias } from "../hooks/useCategorias";

import type { InsumoRequest } from "../interfaces/Insumo";

interface InsumoFormProps {
    onSubmit: (insumo: InsumoRequest) => void;
    valoresIniciales?: InsumoRequest;
    textoBoton?: string;
    isPending?: boolean;
}

const input =
    "w-full rounded-lg border border-petro/20 bg-blanco px-3 py-2 text-sm text-petro outline-none focus:border-turquesa focus:ring-2 focus:ring-turquesa/20";

export default function InsumoForm({
    onSubmit,
    valoresIniciales,
    textoBoton = "Guardar insumo",
    isPending = false,
}: InsumoFormProps) {
    const { data: categorias = [], isLoading: categoriasCargando } =
        useCategorias();

    const form = useForm({
        defaultValues: {
            nombre: valoresIniciales?.nombre ?? "",
            categoriaId: valoresIniciales?.categoriaId ?? 0,
            puntoControl: valoresIniciales?.puntoControl ?? 1,
            critico: valoresIniciales?.critico ?? false,
            esOxigeno: valoresIniciales?.esOxigeno ?? false,
            capacidadMaxima: valoresIniciales?.capacidadMaxima ?? 0,
        } as InsumoRequest,

        validators: {
            onSubmit: ({ value }) => {
                if (!value.nombre.trim()) {
                    return {
                        fields: {
                            nombre: "El nombre es obligatorio",
                        },
                    };
                }

                if (value.categoriaId <= 0) {
                    return {
                        fields: {
                            categoriaId: "Debe seleccionar una categoría",
                        },
                    };
                }

                if (value.puntoControl <= 0) {
                    return {
                        fields: {
                            puntoControl: "El punto de control debe ser mayor a 0",
                        },
                    };
                }

                if (value.esOxigeno && value.capacidadMaxima <= 0) {
                    return {
                        fields: {
                            capacidadMaxima: "La capacidad máxima debe ser mayor a 0",
                        },
                    };
                }

                return undefined;
            },
        },

        onSubmit: async ({ value }) => {
            onSubmit({
                nombre: value.nombre.trim(),
                categoriaId: value.categoriaId,
                puntoControl: value.puntoControl,
                critico: value.critico,
                esOxigeno: value.esOxigeno,
                capacidadMaxima: value.esOxigeno ? value.capacidadMaxima : 0,
            });
        },
    });

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                form.handleSubmit();
            }}
            className="flex flex-col gap-4"
        >
            <form.Field name="nombre">
                {(field) => (
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor={field.name}
                            className="text-sm font-medium text-petro"
                        >
                            Nombre
                        </label>

                        <input
                            id={field.name}
                            name={field.name}
                            type="text"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(event) => field.handleChange(event.target.value)}
                            placeholder="Nombre del insumo"
                            className={input}
                        />

                        {field.state.meta.errors.map((error) => (
                            <p key={String(error)} className="text-xs text-coral">
                                {String(error)}
                            </p>
                        ))}
                    </div>
                )}
            </form.Field>

            <form.Field name="categoriaId">
                {(field) => (
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor={field.name}
                            className="text-sm font-medium text-petro"
                        >
                            Categoría
                        </label>

                        <select
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            disabled={categoriasCargando}
                            onBlur={field.handleBlur}
                            onChange={(event) =>
                                field.handleChange(Number(event.target.value))
                            }
                            className={input}
                        >
                            <option value={0}>Seleccionar categoría</option>

                            {categorias.map((categoria) => (
                                <option key={categoria.id} value={categoria.id}>
                                    {categoria.nombre}
                                </option>
                            ))}
                        </select>

                        {field.state.meta.errors.map((error) => (
                            <p key={String(error)} className="text-xs text-coral">
                                {String(error)}
                            </p>
                        ))}
                    </div>
                )}
            </form.Field>

            <form.Field name="puntoControl">
                {(field) => (
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor={field.name}
                            className="text-sm font-medium text-petro"
                        >
                            Punto de control
                        </label>

                        <input
                            id={field.name}
                            name={field.name}
                            type="number"
                            min={1}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(event) =>
                                field.handleChange(Number(event.target.value))
                            }
                            className={input}
                        />

                        {field.state.meta.errors.map((error) => (
                            <p key={String(error)} className="text-xs text-coral">
                                {String(error)}
                            </p>
                        ))}
                    </div>
                )}
            </form.Field>


            <form.Field name="esOxigeno">
                {(field) => (
                    <label className="flex items-center gap-3 rounded-lg border border-petro/10 p-3">
                        <input
                            type="checkbox"
                            checked={field.state.value}
                            onChange={(event) => {
                                const esOxigeno = event.target.checked;

                                field.handleChange(esOxigeno);

                                if (esOxigeno) {
                                    form.setFieldValue("critico", true);
                                }
                            }}
                            className="h-4 w-4 accent-turquesa"
                        />

                        <div>
                            <p className="text-sm font-semibold text-petro">
                                Insumo de oxígeno
                            </p>

                            <p className="text-xs text-petro/60">
                                Marcar si el insumo representa un tubo de oxígeno.
                            </p>
                        </div>
                    </label>
                )}
            </form.Field>

            <form.Subscribe selector={(state) => state.values.esOxigeno}>
                {(esOxigeno) =>
                    esOxigeno ? (
                        <form.Field name="capacidadMaxima">
                            {(field) => (
                                <div className="flex flex-col gap-2">
                                    <label
                                        htmlFor={field.name}
                                        className="text-sm font-medium text-petro"
                                    >
                                        Capacidad máxima
                                    </label>

                                    <div className="flex items-center gap-3">
                                        <input
                                            id={field.name}
                                            name={field.name}
                                            type="number"
                                            min={1}
                                            step={1}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(event) =>
                                                field.handleChange(
                                                    Number(event.target.value)
                                                )
                                            }
                                            className={input}
                                        />

                                        <span className="min-w-fit text-sm font-medium text-petro/60">
                                            bar
                                        </span>
                                    </div>

                                    {field.state.meta.errors.map((error) => (
                                        <p
                                            key={String(error)}
                                            className="text-xs text-coral"
                                        >
                                            {String(error)}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </form.Field>
                    ) : null
                }
            </form.Subscribe>

            <form.Subscribe selector={(state) => state.values.esOxigeno}>
                {(esOxigeno) => (
                    <form.Field name="critico">
                        {(field) => (
                            <label
                                className={`flex items-center gap-3 rounded-lg border p-3 ${esOxigeno
                                    ? "cursor-not-allowed border-petro/10 bg-petro/5 opacity-60"
                                    : "border-petro/10"
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={field.state.value}
                                    disabled={esOxigeno}
                                    onChange={(event) => field.handleChange(event.target.checked)}
                                    className="h-4 w-4 accent-turquesa"
                                />

                                <div>
                                    <p className="text-sm font-semibold text-petro">
                                        Insumo crítico
                                    </p>

                                    <p className="text-xs text-petro/60">
                                        {esOxigeno
                                            ? "Los insumos de oxígeno son críticos obligatoriamente."
                                            : "Marcar si requiere tratamiento como insumo crítico."}
                                    </p>
                                </div>
                            </label>
                        )}
                    </form.Field>


                )}
            </form.Subscribe>

            <button
                type="submit"
                disabled={isPending}
                className="rounded-lg bg-turquesa px-4 py-2 text-sm font-semibold text-blanco transition hover:bg-petro disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isPending ? "Guardando..." : textoBoton}
            </button>
        </form>
    );
}
