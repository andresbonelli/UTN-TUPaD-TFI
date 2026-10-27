import { useForm } from "@tanstack/react-form";
import { useNavigate } from "react-router-dom";

import { useLogin } from "../hooks/useAuth";
import { useAuthStore } from "../stores/authStore";

import type { LoginRequest } from "../interfaces/Auth";

export default function Login() {
    const navigate = useNavigate();

    const loginMutation = useLogin();

    const usuario = useAuthStore(
        (state) => state.usuario
    );

    const form = useForm({
        defaultValues: {
            mail: "",
            clave: "",
        } as LoginRequest,

        validators: {
            onSubmit: ({ value }) => {
                if (!value.mail.trim()) {
                    return "El mail es obligatorio";
                }

                if (!value.clave.trim()) {
                    return "La clave es obligatoria";
                }

                if (value.clave.length < 6) {
                    return "La clave debe tener al menos 6 caracteres";
                }

                return undefined;
            },
        },

        onSubmit: async ({ value }) => {
            loginMutation.mutate(
                {
                    mail: value.mail.trim(),
                    clave: value.clave,
                },
                {
                    onSuccess: () => {
                        const usuarioAutenticado = useAuthStore.getState().usuario;

                        if (!usuarioAutenticado) {
                            return;
                        }

                        if (
                            usuarioAutenticado.rol === "ENFERMERO"
                        ) {
                            navigate("/operativo", {
                                replace: true,
                            });

                            return;
                        }

                        if (usuarioAutenticado.rol === "ADMINISTRADOR") {
                            navigate("/admin", {
                                replace: true,
                            });
                        }
                    },
                }
            );
        },
    });

    return (
        <main className="flex min-h-screen items-center justify-center bg-fondo p-6 text-petro">
            <section className="w-full max-w-md rounded-xl bg-blanco p-6 shadow-sm">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-petro">
                        Control107
                    </h1>

                    <p className="mt-2 text-sm text-petro/60">
                        Ingresa con tus credenciales para continuar.
                    </p>
                </div>

                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        form.handleSubmit();
                    }}
                    className="space-y-5"
                >
                    <form.Field name="mail">
                        {(field) => (
                            <div>
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
                                    autoComplete="username"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(event) =>
                                        field.handleChange(
                                            event.target.value
                                        )
                                    }
                                    className="mt-2 w-full rounded-lg border border-petro/20 bg-blanco px-3 py-2 text-petro outline-none focus:border-turquesa focus:ring-2 focus:ring-turquesa/20"
                                />
                            </div>
                        )}
                    </form.Field>

                    <form.Field name="clave">
                        {(field) => (
                            <div>
                                <label
                                    htmlFor={field.name}
                                    className="text-sm font-medium text-petro"
                                >
                                    Clave
                                </label>

                                <input
                                    id={field.name}
                                    name={field.name}
                                    type="password"
                                    autoComplete="current-password"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(event) =>
                                        field.handleChange(
                                            event.target.value
                                        )
                                    }
                                    className="mt-2 w-full rounded-lg border border-petro/20 bg-blanco px-3 py-2 text-petro outline-none focus:border-turquesa focus:ring-2 focus:ring-turquesa/20"
                                />
                            </div>
                        )}
                    </form.Field>

                    {loginMutation.isError && (
                        <div className="rounded-lg border border-coral/30 bg-coral/5 p-3">
                            <p className="text-sm font-semibold text-coral">
                                Credenciales inválidas.
                            </p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loginMutation.isPending}
                        className="w-full rounded-lg bg-turquesa px-4 py-2 font-semibold text-blanco transition hover:bg-petro disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loginMutation.isPending
                            ? "Ingresando..."
                            : "Ingresar"}
                    </button>
                </form>

                {usuario && (
                    <p className="mt-4 text-xs text-petro/50">
                        Sesión iniciada como {usuario.email}
                    </p>
                )}
            </section>
        </main>
    );
}