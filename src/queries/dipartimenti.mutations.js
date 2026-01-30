import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { api } from "../api/apiClient.js";

export function useAddDipartimento(universityId) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["addDipartimento", universityId],
        mutationFn: async ({ nome }) => {
            const res = await api.post(`/universita/${universityId}/dipartimenti`, { nome });
            return res.data;
        },
        onSuccess: () => {
            message.success("Dipartimento aggiunto con successo");
            queryClient.invalidateQueries({ queryKey: ["dipartimenti", universityId] });
        },
        onError: (err) => {
            message.error(err?.response?.data || "Errore durante la creazione");
        },
    });
}

export function useDeleteDipartimento(universityId) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["deleteDipartimento", universityId],
        mutationFn: async (departmentId) => {
            const res = await api.delete(`/universita/dipartimenti/${departmentId}`);
            return res.data;
        },
        onSuccess: () => {
            message.success("Dipartimento eliminato con successo");
            queryClient.invalidateQueries({ queryKey: ["dipartimenti", universityId] });
        },
        onError: (err) => {
            message.error(err?.response?.data || "Errore durante l’eliminazione");
        },
    });
}
