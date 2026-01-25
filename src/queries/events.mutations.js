import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/apiClient.js";

export function useCreateEvent() {
    return useMutation({
        mutationFn: async ({ eventPayload, username }) => {
            console.log("🔹 createEvent chiamato con:", { username, eventPayload });

            const res = await api.post("/eventi/crea", eventPayload, {
                params: { username },
            });

            return res.data;
        },
        mutationKey: ["createEvent"],
    });
};

export function useIscriviEvento() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ eventoId, studenteId }) => {
            const res = await api.post(`/eventi/${eventoId}/iscrivi/${studenteId}`);
            return res.data;
        },
        onSuccess: (_, variables) => {
            // Aggiorna il dettaglio evento dopo iscrizione
            queryClient.invalidateQueries(["event", variables.eventoId]);
        },
    });
}

export function useDisiscriviEvento() {
    return useMutation({
        mutationFn: async ({ eventoId, studenteId }) => {
            const res = await api.post(`/eventi/${eventoId}/disiscrivi/${studenteId}`);
            return res.data;
        },
    });
}
