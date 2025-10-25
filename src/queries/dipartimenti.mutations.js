import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { message } from "antd";

axios.defaults.baseURL = "http://localhost:8080";

export function useAddDipartimento(universitaId) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ nome }) =>
            axios.post(`/api/universita/${universitaId}/dipartimenti`, {
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
            axios.delete(`/api/universita/dipartimenti/${dipartimentoId}`),
        onSuccess: () => {
            message.success("Dipartimento eliminato con successo");
            queryClient.invalidateQueries(["dipartimenti", universitaId]);
        },
        onError: (err) =>
            message.error(err?.response?.data || "Errore durante l’eliminazione"),
    });
}
