import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/apiClient.js";

function getActorId() {
    try {
        return JSON.parse(localStorage.getItem("user"))?.id ?? null;
    } catch {
        return null;
    }
}

export function useCreateMateria() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["create-materia"],
        mutationFn: async (payload) => {
            const actorId = getActorId();
            const { data } = await api.post("/materie", payload, {
                params: { actorId },
            });
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["materie"] }),
    });
}

export function useDeleteMateria() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["delete-materia"],
        mutationFn: async (id) => {
            const actorId = getActorId();
            const { data } = await api.delete(`/materie/${id}`, {
                params: { actorId },
            });
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["materie"] }),
    });
}

export function useCreateAula() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["create-aula"],
        mutationFn: async (payload) => {
            const actorId = getActorId();
            const { data } = await api.post("/aule", payload, {
                params: { actorId },
            });
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["aule"] }),
    });
}

export function useDeleteAula() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["delete-aula"],
        mutationFn: async (id) => {
            const actorId = getActorId();
            const { data } = await api.delete(`/aule/${id}`, {
                params: { actorId },
            });
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["aule"] }),
    });
}

export function useCreateLezione() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["create-lezione"],
        mutationFn: async (payload) => {
            const actorId = getActorId();
            const { data } = await api.post("/lezioni", payload, {
                params: { actorId },
            });
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lezioni"] }),
    });
}

export function useDeleteLezione() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["delete-lezione"],
        mutationFn: async (id) => {
            const actorId = getActorId();
            const { data } = await api.delete(`/lezioni/${id}`, {
                params: { actorId },
            });
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lezioni"] }),
    });
}

export function useUpdateLezione() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["update-lezione"],
        mutationFn: async ({ id, payload }) => {
            const actorId = getActorId();
            const { data } = await api.put(`/lezioni/${id}`, payload, {
                params: { actorId },
            });
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lezioni"] }),
    });
}
