import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/apiClient.js";

export function useCreateComment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["createComment"],
        mutationFn: async (payload) => {
            const { data } = await api.post("/commenti", payload);
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["comments", variables.eventoId] });
        },
    });
}

export function useDeleteComment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["deleteComment"],
        mutationFn: async ({ commentId, eventoId }) => {
            await api.delete(`/commenti/${commentId}`);
            return { commentId, eventoId };
        },
        onSuccess: (_, { eventoId }) => {
            queryClient.invalidateQueries({ queryKey: ["comments", eventoId] });
        },
    });
}
