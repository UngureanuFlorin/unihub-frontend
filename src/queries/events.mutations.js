import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/apiClient.js";

export function useCreateEvent() {
    return useMutation({
        mutationKey: ["createEvent"],
        mutationFn: async ({ eventPayload, username }) => {
            const res = await api.post("/eventi/crea", eventPayload, {
                params: { username },
            });
            return res.data;
        },
    });
}

export function useIscriviEvento() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["iscriviEvento"],
        mutationFn: async ({ eventoId, studenteId }) => {
            const res = await api.post(`/eventi/${eventoId}/iscrivi/${studenteId}`);
            return res.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["event", variables.eventoId] });
        },
    });
}

export function useDisiscriviEvento() {
    return useMutation({
        mutationKey: ["disiscriviEvento"],
        mutationFn: async ({ eventoId, studenteId }) => {
            const res = await api.post(`/eventi/${eventoId}/disiscrivi/${studenteId}`);
            return res.data;
        },
    });
}

export function useUpdateEvent() {
    return useMutation({
        mutationKey: ["updateEvent"],
        mutationFn: async ({ eventoId, payload, editorId }) => {
            const res = await api.put(`/eventi/${eventoId}`, payload, {
                params: editorId ? { editorId } : undefined,
            });
            return res.data;
        },
    });
}
