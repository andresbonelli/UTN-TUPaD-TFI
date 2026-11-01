import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";

import type { JwtPayload, UsuarioAutenticado } from "../interfaces/Auth";

interface AuthState {
    token: string | null;
    usuario: UsuarioAutenticado | null;
    sesionRestaurada: boolean;

    guardarSesion: (token: string) => void;
    cerrarSesion: () => void;
    restaurarSesion: () => void;
}

function obtenerUsuarioDesdeToken(token: string): UsuarioAutenticado | null {
    try {
        const payload = jwtDecode<JwtPayload>(token);

        const ahora = Date.now() / 1000;

        if (payload.exp <= ahora) {
            return null;
        }

        const id = Number(payload.sub);

        if (Number.isNaN(id)) {
            return null;
        }

        return {
            id,
            email: payload.mail,
            rol: payload.rol,
        };
    } catch {
        return null;
    }
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            token: null,
            usuario: null,
            sesionRestaurada: false,

            guardarSesion: (token) => {
                const usuario = obtenerUsuarioDesdeToken(token);

                if (!usuario) {
                    set({
                        token: null,
                        usuario: null,
                    });

                    return;
                }

                set({
                    token,
                    usuario,
                });
            },

            cerrarSesion: () => {
                set({
                    token: null,
                    usuario: null,
                });
            },

            restaurarSesion: () => {
                const token = get().token;

                if (!token) {
                    set({
                        usuario: null,
                        sesionRestaurada: true,
                    });

                    return;
                }

                const usuario = obtenerUsuarioDesdeToken(token);

                if (!usuario) {
                    set({
                        token: null,
                        usuario: null,
                        sesionRestaurada: true,
                    });

                    return;
                }

                set({
                    usuario,
                    sesionRestaurada: true,
                });
            },
        }),
        {
            name: "control107-auth",

            storage: createJSONStorage(() => sessionStorage),

            partialize: (state) => ({
                token: state.token,
            }),
        },
    ),
);
