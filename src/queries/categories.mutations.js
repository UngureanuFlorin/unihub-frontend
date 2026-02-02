import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/apiClient.js";

function getStoredUserId() {
    try {
        return JSON.parse(localStorage.getItem("user"))?.id ?? null;
    } catch {
        return null;
    }
}

export function useCreateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["create-category"],
        mutationFn: async (name) => {
            const actorId = getStoredUserId();
            const res = await api.post(
                "/categories",
                { nome: name },
                { params: actorId ? { actorId } : {} }
            );
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });
}

export function useDeleteCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["delete-category"],
        mutationFn: async (categoryId) => {
            const actorId = getStoredUserId();
            const res = await api.delete(`/categories/${categoryId}`, {
                params: actorId ? { actorId } : {},
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });
}
