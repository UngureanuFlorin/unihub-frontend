import { useMutation } from "@tanstack/react-query";
import { api } from "../api/apiClient.js";

export function useReportSupport() {
    return useMutation({
        mutationKey: ["reportSupport"],
        mutationFn: async (payload) => {
            const res = await api.post("/support/report", payload);
            return res.data;
        },
    });
}
