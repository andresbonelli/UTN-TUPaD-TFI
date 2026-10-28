import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Insumo, InsumoRequest } from "../interfaces/Insumo";
import { actualizarInsumo, crearInsumo, listarInsumos } from "../services/insumo";

export function useInsumos() {
    return useQuery<Insumo[]>({
        queryKey: ["insumos"],
        queryFn: listarInsumos,
    });
}

//temporal DEBUG
import axios from "axios";

export function useCrearInsumo() {
    const queryClient = useQueryClient();

    return useMutation<
        Insumo,
        Error,
        InsumoRequest
    >({
        mutationFn: crearInsumo,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["insumos"],
            });
        },

        // onError: (error) => {
        //     console.error(
        //         "Error al crear el insumo:",
        //         error
        //     );
        // },
        onError: (error) => {
            if (axios.isAxiosError(error)) {
                console.error(
                    "Respuesta del backend:",
                    error.response?.data
                );

                return;
            }

            console.error(
                "Error al crear el insumo:",
                error
            );
        },

    });
}

export function useActualizarInsumo() {
    const queryClient = useQueryClient();

    return useMutation<
        Insumo,
        Error,
        {
            id: number;
            insumo: InsumoRequest;
        }
    >({
        mutationFn: ({ id, insumo }) =>
            actualizarInsumo(id, insumo),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["insumos"],
            });
        },

        onError: (error) => {
            console.error(
                "Error al actualizar el insumo:",
                error
            );
        },
    });
}