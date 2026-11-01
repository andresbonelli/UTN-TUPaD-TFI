import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import type {
    ActualizarUsuarioRequest,
    Usuario,
    UsuarioRequest,
} from "../interfaces/Usuario";

import {
    actualizarUsuario,
    crearUsuario,
    eliminarUsuario,
    listarUsuarios,
} from "../services/usuario";

export function useUsuarios() {
    return useQuery<Usuario[]>({
        queryKey: ["usuarios"],
        queryFn: listarUsuarios,
    });
}

export function useCrearUsuario() {
    const queryClient = useQueryClient();

    return useMutation<
        Usuario,
        Error,
        UsuarioRequest
    >({
        mutationFn: crearUsuario,

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["usuarios"],
            });
        },
    });
}


export function useActualizarUsuario() {
    const queryClient = useQueryClient();

    return useMutation<
        Usuario,
        Error,
        {
            id: number;
            usuario: ActualizarUsuarioRequest;
        }
    >({
        mutationFn: ({ id, usuario }) =>
            actualizarUsuario(id, usuario),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["usuarios"],
            });
        },
    });
}

export function useEliminarUsuario() {
    const queryClient = useQueryClient();

    return useMutation<
        void,
        Error,
        number
    >({
        mutationFn: eliminarUsuario,

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["usuarios"],
            });
        },
    });
}