import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/apiClient.js";

function getStoredUserId() {
    try {
        return JSON.parse(localStorage.getItem("user"))?.id ?? null;
    } catch {
        return null;
    }
}

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
            const actorId = getStoredUserId();
            const res = await api.patch(
                `/reports/${reportId}`,
                { status },
                { params: actorId ? { actorId } : {} }
            );
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reports"] });
        },
    });
}
