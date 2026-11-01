import { useForm } from "@tanstack/react-form";

import { useCancelarTurno } from "../../hooks/useTurnos";

interface CancelarTurnoProps {
    turnoId: number;
}

interface CancelarTurnoFormValues {
    observaciones: string;
}

export default function CancelarTurno({
    turnoId,
}: CancelarTurnoProps) {
    const cancelarTurnoMutation = useCancelarTurno();

    const form = useForm({
        defaultValues: { observaciones: "" } as CancelarTurnoFormValues,

        validators: {
            onSubmit: ({ value }) => {
                if (!value.observaciones.trim()) {
                    return "Debes indicar el motivo de la cancelación";
                }

                return undefined;
            },
        },

        onSubmit: async ({ value }) => {
            cancelarTurnoMutation.mutate({
                turnoId,
                request: {
                    observaciones: value.observaciones.trim(),
                },
            });
        },
    });

    return (
        <section className="mt-6 rounded-xl border border-coral/30 bg-coral/5 p-6">
            <h2 className="text-xl font-semibold text-petro">
                Cancelar turno
            </h2>

            <p className="mt-2 text-sm text-petro/60">
                Cancela el turno si existe una condición que impide comenzar la guardia.
            </p>

            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    form.handleSubmit();
                }}
                className="mt-4 space-y-4"
            >
                <form.Field name="observaciones">
                    {(field) => (
                        <div>
                            <label
                                htmlFor={field.name}
                                className="text-sm font-medium text-petro"
                            >
                                Motivo de cancelación
                            </label>

                            <textarea
                                id={field.name}
                                name={field.name}
                                rows={3}
                                placeholder="Indica el motivo por el que no se puede iniciar el turno"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(event) =>
                                    field.handleChange(event.target.value)
                                }
                                className="mt-2 w-full resize-none rounded-lg border border-petro/20 bg-blanco px-3 py-2 text-petro outline-none focus:border-coral focus:ring-2 focus:ring-coral/20"
                            />
                        </div>
                    )}
                </form.Field>

                {cancelarTurnoMutation.isError && (
                    <div className="rounded-lg border border-coral/30 bg-blanco p-4">
                        <p className="font-semibold text-coral">
                            No se pudo cancelar el turno.
                        </p>

                        <p className="mt-1 text-sm text-petro/70">
                            {cancelarTurnoMutation.error.message}
                        </p>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={cancelarTurnoMutation.isPending}
                    className="rounded-lg bg-coral px-4 py-2 text-sm font-semibold text-blanco transition hover:bg-petro disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {cancelarTurnoMutation.isPending
                        ? "Cancelando..."
                        : "Cancelar turno"}
                </button>
            </form>
        </section>
    );
}