import { useQuery } from "@tanstack/react-query";
import { api } from "../api/apiClient.js";

function getStoredUserId() {
    try {
        return JSON.parse(localStorage.getItem("user"))?.id ?? null;
    } catch {
        return null;
    }
}

async function fetchFeed() {
    const userId = getStoredUserId();
    if (!userId) return [];
    const { data } = await api.get("/posts/feed", { params: { userId } });
    return Array.isArray(data) ? data : [];
}

export function useFeedPosts() {
    return useQuery({
        queryKey: ["feed-posts"],
        queryFn: fetchFeed,
    });
}
