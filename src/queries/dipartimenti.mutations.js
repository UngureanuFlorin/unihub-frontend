import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/apiClient.js";
import { message } from "antd";

export function useAddDipartimento(universitaId) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ nome }) =>
            api.post(`/universita/${universitaId}/dipartimenti`, {
                nome,
            }),
        onSuccess: () => {
            message.success("Dipartimento aggiunto con successo");
            queryClient.invalidateQueries(["dipartimenti", universitaId]);
        },
        onError: (err) =>
            message.error(err?.response?.data || "Errore durante la creazione"),
    });
}

export function useDeleteDipartimento(universitaId) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (dipartimentoId) =>
            api.delete(`/universita/dipartimenti/${dipartimentoId}`),
        onSuccess: () => {
            message.success("Dipartimento eliminato con successo");
            queryClient.invalidateQueries(["dipartimenti", universitaId]);
        },
        onError: (err) =>
            message.error(err?.response?.data || "Errore durante l’eliminazione"),
    });
}
