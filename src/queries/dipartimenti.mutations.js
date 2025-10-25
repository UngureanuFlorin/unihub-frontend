import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { message } from "antd";

axios.defaults.baseURL = "http://localhost:8080";

// 🔹 Crea dipartimento
export function useAddDipartimento(universitaId) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ nome, descrizione }) =>
            axios.post(`/api/universita/${universitaId}/dipartimenti`, {
                nome,
                descrizione,
            }),
        onSuccess: () => {
            message.success("Dipartimento creato con successo");
            queryClient.invalidateQueries(["dipartimenti", universitaId]);
        },
        onError: () => message.error("Errore durante la creazione"),
    });
}

// 🔹 Elimina dipartimento
export function useDeleteDipartimento(universitaId) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (dipartimentoId) =>
            axios.delete(`/api/universita/dipartimenti/${dipartimentoId}`),
        onSuccess: () => {
            message.success("Dipartimento eliminato");
            queryClient.invalidateQueries(["dipartimenti", universitaId]);
        },
        onError: () => message.error("Errore durante l’eliminazione"),
    });
}
