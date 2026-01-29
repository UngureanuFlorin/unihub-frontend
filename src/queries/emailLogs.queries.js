import { useQuery } from "@tanstack/react-query";
import { api } from "../api/apiClient.js";

export function useEmailLogs({ status, type } = {}) {
    return useQuery({
        queryKey: ["email-logs", status || "all", type || "all"],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (status) params.set("status", status);
            if (type) params.set("type", type);
            const suffix = params.toString() ? `?${params.toString()}` : "";
            const { data } = await api.get(`/email-logs${suffix}`);
            return data;
        },
    });
}
