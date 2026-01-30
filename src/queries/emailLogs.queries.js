import { useQuery } from "@tanstack/react-query";
import { api } from "../api/apiClient.js";

async function fetchEmailLogs({ status, type }) {
    const params = new URLSearchParams();

    if (status) params.set("status", status);
    if (type) params.set("type", type);

    const query = params.toString();
    const { data } = await api.get(`/email-logs${query ? `?${query}` : ""}`);

    return data;
}

export function useEmailLogs({ status, type } = {}) {
    return useQuery({
        queryKey: ["email-logs", status || "all", type || "all"],
        queryFn: () => fetchEmailLogs({ status, type }),
    });
}
