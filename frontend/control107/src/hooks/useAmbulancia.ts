import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import type {
    Ambulancia,
    AmbulanciaRequest,
} from "../interfaces/Ambulancia";

import {
    actualizarAmbulancia,
    crearAmbulancia,
    listarAmbulancias,
} from "../services/ambulancia";

export function useAmbulancias() {
    return useQuery<Ambulancia[]>({
        queryKey: ["ambulancias"],
        queryFn: listarAmbulancias,
    });
}

export function useCrearAmbulancia() {
    const queryClient = useQueryClient();

    return useMutation<
        Ambulancia,
        Error,
        AmbulanciaRequest
    >({
        mutationFn: crearAmbulancia,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["ambulancias"],
            });
        },

        onError: (error) => {
            console.error(
                "Error al crear la ambulancia:",
                error
            );
        },
    });
}

export function useActualizarAmbulancia() {
    const queryClient = useQueryClient();

    return useMutation<
        Ambulancia,
        Error,
        {
            id: number;
            ambulancia: AmbulanciaRequest;
        }
    >({
        mutationFn: ({ id, ambulancia }) =>
            actualizarAmbulancia(
                id,
                ambulancia
            ),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["ambulancias"],
            });
        },

        onError: (error) => {
            console.error(
                "Error al actualizar la ambulancia:",
                error
            );
        },
    });
}