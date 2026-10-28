import axios from "axios";

import type { ApiError } from "../interfaces/ApiError";

export function obtenerMensajeError(
    error: unknown
): string {
    if (axios.isAxiosError<ApiError>(error)) {
        const detalles =
            error.response?.data.detalles;

        if (detalles && detalles.length > 0) {
            return detalles[0];
        }

        const mensajeGeneral =
            error.response?.data.error;

        if (mensajeGeneral) {
            return mensajeGeneral;
        }

        if (!error.response) {
            return "No se pudo conectar con el servidor";
        }

        return error.message;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "Ocurrió un error inesperado";
}