import { useQuery } from "@tanstack/react-query";
import { api } from "../api/apiClient.js";

async function fetchReports(filters) {
    const params = {};

    if (filters.status) params.status = filters.status;
    if (filters.type) params.type = filters.type;

    const { data } = await api.get("/reports", { params });
    return data;
}

export function useReports(filters = {}) {
    return useQuery({
        queryKey: ["reports", filters],
        queryFn: () => fetchReports(filters),
    });
}
