import { useMutation } from "@tanstack/react-query";

import { login } from "../services/auth";
import { useAuthStore } from "../stores/authStore";

import type {
    LoginRequest,
    LoginResponse,
} from "../interfaces/Auth";

export function useLogin() {
    const guardarSesion = useAuthStore(
        (state) => state.guardarSesion
    );

    return useMutation<
        LoginResponse,
        Error,
        LoginRequest
    >({
        mutationFn: login,

        onSuccess: (data) => {
            guardarSesion(data.access_token);
        },
    });
}