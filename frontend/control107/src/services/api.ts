// export const API_URL = "http://localhost:8080/api/v1";

import axios from "axios";

import { useAuthStore } from "../stores/authStore";

export const API_URL = "http://localhost:8080/api/v1";

export const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
});

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});