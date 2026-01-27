import { useQuery } from "@tanstack/react-query";
import {api} from "../api/apiClient.js";

/**
 * Recupera tutti i messaggi di un utente
 */
export function useUserMessages(userId) {
    return useQuery({
        queryKey: ["messages", userId],
        queryFn: async () => {
            if (!userId) return [];
            const { data } = await api.get(`/messages/user/${userId}`);
            return data;
        },
        enabled: !!userId, // evita chiamata se userId è null/undefined
    });
}

/**
 * Recupera il numero di messaggi non letti di un utente
 */
export function useUnreadMessages(userId) {
    return useQuery({
        queryKey: ["unreadMessages", userId],
        queryFn: async () => {
            if (!userId) return 0;
            const { data } = await api.get(`/messages/unread/${userId}`);
            return data.count;
        },
        enabled: !!userId,
        refetchInterval: 5000, // aggiorna ogni 5 secondi
    });
}
