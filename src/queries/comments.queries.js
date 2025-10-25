import { useQuery } from "@tanstack/react-query";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080";

export function useCommentsByEvento(eventoId) {
    return useQuery({
        queryKey: ["comments", eventoId],
        queryFn: async () => {
            const { data } = await axios.get(`/api/commenti/evento/${eventoId}`);
            return data;
        },
        enabled: !!eventoId,
    });
}

async function fetchCommentsByAuthor(authorId) {
    const res = await axios.get(`/api/commenti/autore/${authorId}`);
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