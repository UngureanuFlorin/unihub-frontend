import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/apiClient.js";

export function useCreateReport() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["create-report"],
        mutationFn: async (payload) => {
            const { data } = await api.post("/reports", payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reports"] });
        },
    });
}

export function useUpdateReportStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["update-report-status"],
        mutationFn: async ({ reportId, status, actorId }) => {
            const { data } = await api.patch(`/reports/${reportId}`, { status }, { params: { actorId } });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reports"] });
        },
    });
}
