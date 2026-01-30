import { useQuery } from "@tanstack/react-query";
import { api } from "../api/apiClient.js";

async function fetchCommentsByEvent(eventId) {
    const { data } = await api.get(`/commenti/evento/${eventId}`);
    return data;
}

async function fetchCommentsByAuthor(authorId) {
    const { data } = await api.get(`/commenti/autore/${authorId}`);
    return data;
}

export function useCommentsByEvento(eventoId) {
    return useQuery({
        queryKey: ["comments", eventoId],
        queryFn: () => fetchCommentsByEvent(eventoId),
        enabled: Boolean(eventoId),
    });
}

export function useCommentsByAuthor(authorId) {
    return useQuery({
        queryKey: ["comments-by-author", authorId],
        queryFn: () => fetchCommentsByAuthor(authorId),
        enabled: Boolean(authorId),
    });
}
