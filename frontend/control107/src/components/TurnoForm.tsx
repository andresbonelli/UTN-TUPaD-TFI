import { useForm } from "@tanstack/react-form";

import { useAmbulancias } from "../hooks/useAmbulancia";
import { useUsuarios } from "../hooks/useUsuarios";

import type {
    HorarioTurno,
    TurnoRequest,
} from "../interfaces/Turno";

interface TurnoFormProps {
    onSubmit: (turno: TurnoRequest) => void;
    valoresIniciales?: TurnoRequest;
    textoBoton?: string;
    isPending?: boolean;
}

const input =
    "w-full rounded-lg border border-petro/20 bg-blanco px-3 py-2 text-sm text-petro outline-none focus:border-turquesa focus:ring-2 focus:ring-turquesa/20";

export default function TurnoForm({
    onSubmit,
    valoresIniciales,
    textoBoton = "Guardar turno",
    isPending = false,
}: TurnoFormProps) {
    const {
        data: usuarios = [],
        isLoading: usuariosCargando,
    } = useUsuarios();

    const {
        data: ambulancias = [],
        isLoading: ambulanciasCargando,
    } = useAmbulancias();

    const enfermeros = usuarios.filter(
        (usuario) =>
            usuario.rol === "ENFERMERO" &&
            (
                usuario.activo ||
                usuario.id === valoresIniciales?.enfermeroId
            ),
    );

    const ambulanciasSeleccionables = ambulancias.filter(
        (ambulancia) =>
            ambulancia.disponible ||
            ambulancia.id === valoresIniciales?.ambulanciaId,
    );

    const form = useForm({
        defaultValues: {
            fecha: valoresIniciales?.fecha ?? "",
            horario: valoresIniciales?.horario ?? "MANIANA",
            enfermeroId: valoresIniciales?.enfermeroId ?? 0,
            ambulanciaId: valoresIniciales?.ambulanciaId ?? 0,
            nombreChofer: valoresIniciales?.nombreChofer ?? "",
            nombreMedico: valoresIniciales?.nombreMedico ?? "",
        } as TurnoRequest,

        validators: {
            onSubmit: ({ value }) => {
                if (!value.fecha) {
                    return {
                        fields: {
                            fecha: "La fecha es obligatoria",
                        },
                    };
                }

                if (value.enfermeroId <= 0) {
                    return {
                        fields: {
                            enfermeroId:
                                "Debe seleccionar un enfermero",
                        },
                    };
                }

                if (value.ambulanciaId <= 0) {
                    return {
                        fields: {
                            ambulanciaId:
                                "Debe seleccionar una ambulancia",
                        },
                    };
                }

                if (!value.nombreMedico.trim()) {
                    return {
                        fields: {
                            nombreMedico:
                                "El nombre del médico es obligatorio",
                        },
                    };
                }

                if (!value.nombreChofer.trim()) {
                    return {
                        fields: {
                            nombreChofer:
                                "El nombre del chofer es obligatorio",
                        },
                    };
                }

                return undefined;
            },
        },

        onSubmit: async ({ value }) => {
            onSubmit({
                fecha: value.fecha,
                horario: value.horario,
                enfermeroId: value.enfermeroId,
                ambulanciaId: value.ambulanciaId,
                nombreChofer: value.nombreChofer.trim(),
                nombreMedico: value.nombreMedico.trim(),
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
            <form.Field name="fecha">
                {(field) => (
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor={field.name}
                            className="text-sm font-medium text-petro"
                        >
                            Fecha
                        </label>

                        <input
                            id={field.name}
                            name={field.name}
                            type="date"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(event) =>
                                field.handleChange(event.target.value)
                            }
                            className={input}
                        />

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

            <form.Field name="horario">
                {(field) => (
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor={field.name}
                            className="text-sm font-medium text-petro"
                        >
                            Horario
                        </label>

                        <select
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(event) =>
                                field.handleChange(
                                    event.target.value as HorarioTurno,
                                )
                            }
                            className={input}
                        >
                            <option value="MANIANA">Mañana</option>
                            <option value="TARDE">Tarde</option>
                            <option value="NOCHE">Noche</option>
                        </select>
                    </div>
                )}
            </form.Field>

            <form.Field name="enfermeroId">
                {(field) => (
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor={field.name}
                            className="text-sm font-medium text-petro"
                        >
                            Enfermero
                        </label>

                        <select
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            disabled={usuariosCargando}
                            onBlur={field.handleBlur}
                            onChange={(event) =>
                                field.handleChange(
                                    Number(event.target.value),
                                )
                            }
                            className={input}
                        >
                            <option value={0}>
                                Seleccionar enfermero
                            </option>

                            {enfermeros.map((enfermero) => (
                                <option
                                    key={enfermero.id}
                                    value={enfermero.id}
                                >
                                    {enfermero.nombre} · {enfermero.email}
                                </option>
                            ))}
                        </select>

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

            <form.Field name="ambulanciaId">
                {(field) => (
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor={field.name}
                            className="text-sm font-medium text-petro"
                        >
                            Ambulancia
                        </label>

                        <select
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            disabled={ambulanciasCargando}
                            onBlur={field.handleBlur}
                            onChange={(event) =>
                                field.handleChange(
                                    Number(event.target.value),
                                )
                            }
                            className={input}
                        >
                            <option value={0}>
                                Seleccionar ambulancia
                            </option>

                            {ambulanciasSeleccionables.map(
                                (ambulancia) => (
                                    <option
                                        key={ambulancia.id}
                                        value={ambulancia.id}
                                    >
                                        {ambulancia.patente}
                                    </option>
                                ),
                            )}
                        </select>

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

            <form.Field name="nombreMedico">
                {(field) => (
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor={field.name}
                            className="text-sm font-medium text-petro"
                        >
                            Médico
                        </label>

                        <input
                            id={field.name}
                            name={field.name}
                            type="text"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(event) =>
                                field.handleChange(event.target.value)
                            }
                            placeholder="Nombre del médico"
                            className={input}
                        />

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

            <form.Field name="nombreChofer">
                {(field) => (
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor={field.name}
                            className="text-sm font-medium text-petro"
                        >
                            Chofer
                        </label>

                        <input
                            id={field.name}
                            name={field.name}
                            type="text"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(event) =>
                                field.handleChange(event.target.value)
                            }
                            placeholder="Nombre del chofer"
                            className={input}
                        />

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

            <button
                type="submit"
                disabled={
                    isPending ||
                    usuariosCargando ||
                    ambulanciasCargando
                }
                className="rounded-lg bg-turquesa px-4 py-2 text-sm font-semibold text-blanco transition hover:bg-petro disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isPending ? "Guardando..." : textoBoton}
            </button>
        </form>
    );
}