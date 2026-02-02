import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/apiClient.js";

function getStoredUserId() {
    try {
        return JSON.parse(localStorage.getItem("user"))?.id ?? null;
    } catch {
        return null;
    }
}

export function useCreateUniversita() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["create-universita"],
        mutationFn: async (nome) => {
            const actorId = getStoredUserId();
            const res = await api.post(
                "/universita",
                { nome },
                { params: actorId ? { actorId } : {} }
            );
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["universita"] });
        },
    });
}

export function useDeleteUniversita() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["delete-universita"],
        mutationFn: async (universitaId) => {
            const actorId = getStoredUserId();
            const res = await api.delete(`/universita/${universitaId}`, {
                params: actorId ? { actorId } : {},
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["universita"] });
        },
    });
}
