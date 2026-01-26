import { useMutation } from "@tanstack/react-query";
import { api } from "../api/apiClient.js";

export function useReportSupport() {
    return useMutation({
        mutationKey: ["support-report"],
        mutationFn: async (payload) => {
            const { data } = await api.post("/support/report", payload);
            return data;
        },
    });
}
