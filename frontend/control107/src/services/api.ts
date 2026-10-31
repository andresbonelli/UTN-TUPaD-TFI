import axios from "axios";
import type { AxiosError } from "axios";

import { useAuthStore } from "../stores/authStore";

export const VITE_API_URL =  import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

export const api = axios.create({
    baseURL: VITE_API_URL,
    timeout: 10000,
});

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;

    if (token) {
        config.headers.Authorization =
            `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,

    (error: AxiosError) => {
        const status = error.response?.status;
        const url = error.config?.url ?? "";

        const esPeticionLogin =
            url.includes("/auth/login");

        if (
            status === 401 &&
            !esPeticionLogin
        ) {
            useAuthStore
                .getState()
                .cerrarSesion();
        }

        return Promise.reject(error);
    }
);