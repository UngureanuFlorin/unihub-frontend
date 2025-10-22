import {useMutation, useQueryClient} from "@tanstack/react-query";
import axios from "axios";

export function useCreateEvent() {
    return useMutation({
        mutationFn: async ({ eventPayload, username }) => {
            console.log("🔹 createEvent chiamato con:", { username, eventPayload });

            const res = await axios.post(
                `http://localhost:8080/api/eventi/crea?username=${username}`,
                eventPayload,
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            return res.data;
        },
        mutationKey: ["createEvent"],
    });
};

export function useIscriviEvento() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ eventoId, studenteId }) => {
            const res = await axios.post(`/api/eventi/${eventoId}/iscrivi/${studenteId}`);
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
            const res = await axios.post(`/api/eventi/${eventoId}/disiscrivi/${studenteId}`);
            return res.data;
        },
    });
}
