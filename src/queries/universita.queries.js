import { useQuery } from "@tanstack/react-query";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080";

// 🔹 Tutte le università
export function useUniversitaList() {
    return useQuery({
        queryKey: ["universita"],
        queryFn: () => axios.get("/api/universita").then((r) => r.data),
    });
}

// 🔹 Dipartimenti per una università
export function useDipartimenti(universitaId) {
    return useQuery({
        queryKey: ["dipartimenti", universitaId],
        queryFn: () =>
            axios.get(`/api/universita/${universitaId}/dipartimenti`).then((r) => r.data),
        enabled: !!universitaId,
    });
}
