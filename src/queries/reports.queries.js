import { useQuery } from "@tanstack/react-query";
import { api } from "../api/apiClient.js";

function getStoredUserId() {
    try {
        return JSON.parse(localStorage.getItem("user"))?.id ?? null;
    } catch {
        return null;
    }
}

async function fetchReports(filters) {
    const actorId = getStoredUserId();
    const params = {};

    if (filters.status) params.status = filters.status;
    if (filters.type) params.type = filters.type;
    if (actorId) params.actorId = actorId;

    const { data } = await api.get("/reports", { params });
    return data;
}

export function useReports(filters = {}) {
    return useQuery({
        queryKey: ["reports", filters],
        queryFn: () => fetchReports(filters),
    });
}
