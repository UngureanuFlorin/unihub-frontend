import { useQuery } from "@tanstack/react-query";
import { api } from "../api/apiClient.js";

function getStoredUserId() {
    try {
        return JSON.parse(localStorage.getItem("user"))?.id ?? null;
    } catch {
        return null;
    }
}

async function fetchEmailHistory({ status, type }) {
    const actorId = getStoredUserId();
    const params = new URLSearchParams();

    if (status) params.set("status", status);
    if (type) params.set("type", type);
    if (actorId) params.set("actorId", actorId);

    const query = params.toString();
    const { data } = await api.get(`/email-history${query ? `?${query}` : ""}`);

    return data;
}

export function useEmailHistory({ status, type } = {}) {
    return useQuery({
        queryKey: ["email-history", status || "all", type || "all"],
        queryFn: () => fetchEmailHistory({ status, type }),
    });
}
