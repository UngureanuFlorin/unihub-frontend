import { useQuery } from "@tanstack/react-query";
import { api } from "../api/apiClient.js";

async function fetchUniversita() {
    const { data } = await api.get("/universita");
    return data;
}

async function fetchDipartimenti(universityId) {
    const { data } = await api.get(`/universita/${universityId}/dipartimenti`);
    return data;
}

export function useUniversitaList() {
    return useQuery({
        queryKey: ["universita"],
        queryFn: fetchUniversita,
    });
}

export function useDipartimenti(universitaId) {
    return useQuery({
        queryKey: ["dipartimenti", universitaId],
        queryFn: () => fetchDipartimenti(universitaId),
        enabled: Boolean(universitaId),
    });
}
