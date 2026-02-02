import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/apiClient.js";

function getStoredUserId() {
    try {
        return JSON.parse(localStorage.getItem("user"))?.id ?? null;
    } catch {
        return null;
    }
}

export function useCreateClub() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["create-club"],
        mutationFn: async (payload) => {
            const actorId = getStoredUserId();
            const res = await api.post(`/club/crea/${actorId}`, payload);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clubs"] });
        },
    });
}
