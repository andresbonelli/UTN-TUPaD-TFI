import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    actualizarInsumo,
    crearInsumo,
    eliminarInsumo,
    listarInsumos,
} from "../services/insumo";

import type {
    Insumo,
    InsumoRequest,
} from "../interfaces/Insumo";

export function useInsumos() {
    return useQuery<Insumo[]>({
        queryKey: ["insumos"],
        queryFn: listarInsumos,
    });
}

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
    });
}

export function useEliminarInsumo() {
    const queryClient = useQueryClient();

    return useMutation<void, Error, number>({
        mutationFn: eliminarInsumo,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["insumos"],
            });
        },
    });
}