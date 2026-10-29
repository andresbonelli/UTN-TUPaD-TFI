import { useForm } from "@tanstack/react-form";

import { useInsumos } from "../hooks/useInsumos";

import type { AmbulanciaRequest } from "../interfaces/Ambulancia";

interface AmbulanciaFormProps {
    onSubmit: (ambulancia: AmbulanciaRequest) => void;
    valoresIniciales?: AmbulanciaRequest;
    textoBoton?: string;
    isPending?: boolean;
}

const input =
    "w-full rounded-lg border border-petro/20 bg-blanco px-3 py-2 text-sm text-petro outline-none transition focus:border-turquesa focus:ring-2 focus:ring-turquesa/20";

export const AmbulanciaForm = ({
    onSubmit,
    valoresIniciales,
    textoBoton = "Guardar ambulancia",
    isPending = false,
}: AmbulanciaFormProps) => {
    const {
        data: insumos = [],
        isLoading: insumosCargando,
        isError: insumosError,
    } = useInsumos();

    const form = useForm({
        defaultValues: {
            patente: valoresIniciales?.patente ?? "",
            disponible: valoresIniciales?.disponible ?? true,
            insumos: valoresIniciales?.insumos ?? [],
        } as AmbulanciaRequest,

        validators: {
            onSubmit: ({ value }) => {
                const patenteNormalizada = value.patente
                    .trim()
                    .replace(/\s/g, "")
                    .toUpperCase();

                if (!patenteNormalizada) {
                    return {
                        fields: {
                            patente: "La patente es obligatoria",
                        },
                    };
                }

                const formatoViejo = /^[A-Z]{3}\d{3}$/;

                const formatoMercosur = /^[A-Z]{2}\d{3}[A-Z]{2}$/;

                if (
                    !formatoViejo.test(patenteNormalizada) &&
                    !formatoMercosur.test(patenteNormalizada)
                ) {
                    return {
                        fields: {
                            patente:
                                "Formato de patente inválido. Ejemplos: ABC123 o AB123CD",
                        },
                    };
                }

                if (!valoresIniciales && insumos.length === 0) {
                    return {
                        form: "No hay insumos activos para asignar a la ambulancia",
                    };
                }

                return undefined;
            },
        },

        onSubmit: async ({ value }) => {
            const idsInsumos = valoresIniciales
                ? value.insumos
                : insumos.map((insumo) => insumo.id);

            onSubmit({
                patente: value.patente.trim().replace(/\s/g, "").toUpperCase(),

                disponible: value.disponible,

                insumos: idsInsumos,
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
            <form.Field name="patente">
                {(field) => (
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor={field.name}
                            className="text-sm font-medium text-petro"
                        >
                            Patente
                        </label>

                        <input
                            id={field.name}
                            name={field.name}
                            type="text"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(event) =>
                                field.handleChange(event.target.value.toUpperCase())
                            }
                            placeholder="Ejemplo: AB123CD"
                            maxLength={9}
                            autoComplete="off"
                            className={input}
                        />

                        <p className="text-xs text-petro/60">
                            Se guardará sin espacios y en mayúsculas.
                        </p>

                        {field.state.meta.errors.map((error) => (
                            <p key={String(error)} className="text-xs text-coral">
                                {String(error)}
                            </p>
                        ))}
                    </div>
                )}
            </form.Field>

            <form.Field name="disponible">
                {(field) => (
                    <label className="flex items-center gap-3 rounded-lg border border-petro/10 p-3">
                        <input
                            type="checkbox"
                            checked={field.state.value}
                            onChange={(event) => field.handleChange(event.target.checked)}
                            className="h-4 w-4 accent-turquesa"
                        />

                        <div>
                            <p className="text-sm font-semibold text-petro">
                                Ambulancia disponible
                            </p>

                            <p className="text-xs text-petro/60">
                                Indica si la unidad está disponible para ser asignada.
                            </p>
                        </div>
                    </label>
                )}
            </form.Field>

            <form.Subscribe selector={(state) => state.errors}>
                {(errors) =>
                    errors.map((error) => (
                        <p key={String(error)} className="text-sm font-semibold text-coral">
                            {String(error)}
                        </p>
                    ))
                }
            </form.Subscribe>

            <button
                type="submit"
                disabled={isPending || insumosCargando || insumosError}
                className="rounded-lg bg-turquesa px-4 py-2 text-sm font-semibold text-blanco transition hover:bg-petro disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isPending ? "Guardando..." : textoBoton}
            </button>
        </form>
    );
};
