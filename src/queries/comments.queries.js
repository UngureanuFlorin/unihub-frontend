import { useQuery } from "@tanstack/react-query";
import { api } from "../api/apiClient.js";

export function useCommentsByEvento(eventoId) {
    return useQuery({
        queryKey: ["comments", eventoId],
        queryFn: async () => {
            const { data } = await api.get(`/commenti/evento/${eventoId}`);
            return data;
        },
        enabled: !!eventoId,
    });
}

async function fetchCommentsByAuthor(authorId) {
    const res = await api.get(`/commenti/autore/${authorId}`);
    return res.data;
}

// 🔹 Hook React Query
export function useCommentsByAuthor(authorId) {
    return useQuery({
        queryKey: ["comments-by-author", authorId],
        queryFn: () => fetchCommentsByAuthor(authorId),
        enabled: !!authorId,
    });
}
