import { useQuery } from "@tanstack/react-query";
import { api } from "../api/apiClient.js";

export function useUniversitaList() {
    return useQuery({
        queryKey: ["universita"],
        queryFn: () => api.get("/universita").then((r) => r.data),
    });
}

export function useDipartimenti(universitaId) {
    return useQuery({
        queryKey: ["dipartimenti", universitaId],
        queryFn: () =>
            api.get(`/universita/${universitaId}/dipartimenti`).then((r) => r.data),
        enabled: !!universitaId,
    });
}
