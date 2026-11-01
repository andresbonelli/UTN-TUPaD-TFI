import { useForm } from "@tanstack/react-form";

import type {
    ActualizarUsuarioRequest,
    RolUsuario,
    UsuarioRequest,
} from "../interfaces/Usuario";

interface UsuarioFormProps {
    onSubmit: (usuario: UsuarioRequest | ActualizarUsuarioRequest) => void;
    valoresIniciales?: ActualizarUsuarioRequest;
    textoBoton?: string;
    isPending?: boolean;
}

const input =
    "w-full rounded-lg border border-petro/20 bg-blanco px-3 py-2 text-sm text-petro outline-none transition focus:border-turquesa focus:ring-2 focus:ring-turquesa/20";

export default function UsuarioForm({
    onSubmit,
    valoresIniciales,
    textoBoton = "Guardar usuario",
    isPending = false,
}: UsuarioFormProps) {
    const form = useForm({
        defaultValues: {
            nombre: valoresIniciales?.nombre ?? "",
            dni: valoresIniciales?.dni ?? "",
            email: valoresIniciales?.email ?? "",
            rol: valoresIniciales?.rol ?? "ENFERMERO",
            clave: "",
            activo: valoresIniciales?.activo ?? true,
        } as UsuarioRequest,

        validators: {
            onSubmit: ({ value }) => {
                if (!value.nombre.trim()) {
                    return {
                        fields: {
                            nombre: "El nombre es obligatorio",
                        },
                    };
                }

                const dniNormalizado = value.dni.trim();

                if (!/^\d{8}$/.test(dniNormalizado)) {
                    return {
                        fields: {
                            dni: "El DNI debe contener 8 dígitos",
                        },
                    };
                }

                const emailNormalizado = value.email.trim();

                if (!emailNormalizado) {
                    return {
                        fields: {
                            email: "El email es obligatorio",
                        },
                    };
                }

                const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (!formatoEmail.test(emailNormalizado)) {
                    return {
                        fields: {
                            email: "El formato del email no es válido",
                        },
                    };
                }

                if (!valoresIniciales && !value.clave.trim()) {
                    return {
                        fields: {
                            clave: "La contraseña es obligatoria",
                        },
                    };
                }

                return undefined;
            },
        },

        onSubmit: async ({ value }) => {
            const datosBase: ActualizarUsuarioRequest = {
                nombre: value.nombre.trim(),
                dni: value.dni.trim(),
                email: value.email.trim().toLowerCase(),
                rol: value.rol,
                activo: value.activo,
            };

            if (valoresIniciales) {
                onSubmit(datosBase);

                return;
            }

            onSubmit({
                ...datosBase,
                clave: value.clave,
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
                            placeholder="Nombre y apellido"
                            autoComplete="name"
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

            <form.Field name="dni">
                {(field) => (
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor={field.name}
                            className="text-sm font-medium text-petro"
                        >
                            DNI
                        </label>

                        <input
                            id={field.name}
                            name={field.name}
                            type="text"
                            inputMode="numeric"
                            maxLength={8}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(event) =>
                                field.handleChange(event.target.value.replace(/\D/g, ""))
                            }
                            placeholder="12345678"
                            autoComplete="off"
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

            <form.Field name="email">
                {(field) => (
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor={field.name}
                            className="text-sm font-medium text-petro"
                        >
                            Email
                        </label>

                        <input
                            id={field.name}
                            name={field.name}
                            type="email"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(event) => field.handleChange(event.target.value)}
                            placeholder="usuario@control107.gob.ar"
                            autoComplete="email"
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

            <form.Field name="rol">
                {(field) => (
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor={field.name}
                            className="text-sm font-medium text-petro"
                        >
                            Rol
                        </label>

                        <select
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(event) =>
                                field.handleChange(event.target.value as RolUsuario)
                            }
                            className={input}
                        >
                            <option value="ENFERMERO">Enfermero</option>

                            <option value="ADMINISTRADOR">Administrador</option>
                        </select>
                    </div>
                )}
            </form.Field>

            {!valoresIniciales && (
                <form.Field name="clave">
                    {(field) => (
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor={field.name}
                                className="text-sm font-medium text-petro"
                            >
                                Contraseña
                            </label>

                            <input
                                id={field.name}
                                name={field.name}
                                type="password"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(event) => field.handleChange(event.target.value)}
                                placeholder="Contraseña del usuario"
                                autoComplete="new-password"
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
            )}

            <form.Field name="activo">
                {(field) => (
                    <label className="flex items-center gap-3 rounded-lg border border-petro/10 p-3">
                        <input
                            type="checkbox"
                            checked={field.state.value}
                            onChange={(event) => field.handleChange(event.target.checked)}
                            className="h-4 w-4 accent-turquesa"
                        />

                        <div>
                            <p className="text-sm font-semibold text-petro">Usuario activo</p>

                            <p className="text-xs text-petro/60">
                                Indica si el usuario puede utilizar su cuenta.
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
                disabled={isPending}
                className="rounded-lg bg-turquesa px-4 py-2 text-sm font-semibold text-blanco transition hover:bg-petro disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isPending ? "Guardando..." : textoBoton}
            </button>
        </form>
    );
}
