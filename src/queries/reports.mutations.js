import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/apiClient.js";

export function useCreateReport() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["createReport"],
        mutationFn: async (payload) => {
            const res = await api.post("/reports", payload);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reports"] });
        },
    });
}

export function useUpdateReportStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["updateReportStatus"],
        mutationFn: async ({ reportId, status }) => {
            const res = await api.patch(`/reports/${reportId}`, { status });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reports"] });
        },
    });
}
