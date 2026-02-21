import { useQuery } from "@tanstack/react-query";
import { api } from "../api/apiClient.js";

function getStoredUserId() {
    try {
        return JSON.parse(localStorage.getItem("user"))?.id ?? null;
    } catch {
        return null;
    }
}

async function fetchSavedEvents() {
    const userId = getStoredUserId();
    if (!userId) return [];
    const { data } = await api.get("/bookmarks/events", { params: { userId } });
    return Array.isArray(data) ? data : [];
}

async function fetchSavedPosts() {
    const userId = getStoredUserId();
    if (!userId) return [];
    const { data } = await api.get("/bookmarks/posts", { params: { userId } });
    return Array.isArray(data) ? data : [];
}

export function useSavedEvents() {
    return useQuery({
        queryKey: ["saved-events"],
        queryFn: fetchSavedEvents,
    });
}

export function useSavedPosts() {
    return useQuery({
        queryKey: ["saved-posts"],
        queryFn: fetchSavedPosts,
    });
}
