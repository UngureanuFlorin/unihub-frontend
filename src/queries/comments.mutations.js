import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useCreateComment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (commento) => {
            const { data } = await axios.post("/api/commenti", commento, {
                headers: { "Content-Type": "application/json" },
            });
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
            await axios.delete(`/api/commenti/${commentId}`);
            return { commentId, eventoId };
        },
        onSuccess: (_, { eventoId }) => {
            queryClient.invalidateQueries(["comments", eventoId]);
        },
    });
}
