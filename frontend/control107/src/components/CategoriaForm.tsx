import { useForm } from "@tanstack/react-form";

import type { CategoriaRequest } from "../interfaces/Categoria";

interface CategoriaFormProps {
    onSubmit?: (
        categoria: CategoriaRequest
    ) => void;

    valoresIniciales?: CategoriaRequest;

    textoBoton?: string;
}

const input =
    "w-full rounded-lg border border-petro/20 bg-blanco px-3 py-2 text-sm text-petro outline-none focus:border-turquesa focus:ring-2 focus:ring-turquesa/20";

export default function CategoriaForm({
    onSubmit,
    valoresIniciales,
    textoBoton = "Guardar categoría",
}: CategoriaFormProps) {
    const form = useForm({
        defaultValues: {
            nombre: valoresIniciales?.nombre ?? "",
            color: valoresIniciales?.color ?? "#087E8B",
        } as CategoriaRequest,

        validators: {
            onSubmit: ({ value }) => {
                if (!value.nombre.trim()) {
                    return {
                        fields: {
                            nombre: "El nombre es obligatorio",
                        },
                    };
                }

                return undefined;
            },
        },

        onSubmit: async ({ value }) => {
            onSubmit?.({
                nombre: value.nombre.trim().toUpperCase(),
                color: value.color,
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
                            placeholder="Nombre de la categoría"
                            className={input}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(event) =>
                                field.handleChange(
                                    event.target.value.toUpperCase()
                                )
                            }
                        />

                        {field.state.meta.errors.map(
                            (error) => (
                                <p
                                    key={String(error)}
                                    className="text-xs text-coral"
                                >
                                    {String(error)}
                                </p>
                            )
                        )}
                    </div>
                )}
            </form.Field>

            <form.Field name="color">
                {(field) => (
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor={field.name}
                            className="text-sm font-medium text-petro"
                        >
                            Color
                        </label>

                        <div className="flex items-center gap-3">
                            <input
                                id={field.name}
                                name={field.name}
                                type="color"
                                value={field.state.value}
                                onChange={(event) =>
                                    field.handleChange(
                                        event.target.value
                                    )
                                }
                                className="h-10 w-14 cursor-pointer rounded-lg border border-petro/20 bg-blanco p-1"
                            />

                            <span className="text-sm text-petro/60">
                                {field.state.value}
                            </span>
                        </div>
                    </div>
                )}
            </form.Field>

            <button
                type="submit"
                className="rounded-lg bg-turquesa px-4 py-2 text-sm font-semibold text-blanco transition hover:bg-petro"
            >
                {textoBoton}
            </button>
        </form>
    );
}