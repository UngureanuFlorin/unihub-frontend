import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/apiClient.js";

export function useCreateComment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (commento) => {
            const { data } = await api.post("/commenti", commento);
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(["comments", variables.eventoId]);
        },
    });
}
export function useDeleteComment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ commentId, eventoId }) => {
            await api.delete(`/commenti/${commentId}`);
            return { commentId, eventoId };
        },
        onSuccess: (_, { eventoId }) => {
            queryClient.invalidateQueries(["comments", eventoId]);
        },
    });
}
