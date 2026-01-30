import { useQuery } from "@tanstack/react-query";
import { api } from "../api/apiClient.js";

async function fetchUserMessages(userId) {
    if (!userId) return [];
    const { data } = await api.get(`/messages/user/${userId}`);
    return data;
}

async function fetchUnreadMessagesCount(userId) {
    if (!userId) return 0;
    const { data } = await api.get(`/messages/unread/${userId}`);
    return data.count;
}

export function useUserMessages(userId) {
    return useQuery({
        queryKey: ["messages", userId],
        queryFn: () => fetchUserMessages(userId),
        enabled: Boolean(userId),
    });
}

export function useUnreadMessages(userId) {
    return useQuery({
        queryKey: ["unreadMessages", userId],
        queryFn: () => fetchUnreadMessagesCount(userId),
        enabled: Boolean(userId),
        refetchInterval: 5000,
    });
}
