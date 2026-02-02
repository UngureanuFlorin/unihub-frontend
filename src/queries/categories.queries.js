import { useQuery } from "@tanstack/react-query";
import { api } from "../api/apiClient.js";

async function fetchCategories() {
    const { data } = await api.get("/categories");
    return Array.isArray(data) ? data : [];
}

export function useCategories() {
    return useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories,
    });
}
