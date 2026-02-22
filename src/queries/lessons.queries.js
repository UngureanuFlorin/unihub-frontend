import { useQuery } from "@tanstack/react-query";
import { api } from "../api/apiClient.js";

async function fetchMaterie() {
    const { data } = await api.get("/materie");
    return data;
}

async function fetchAule() {
    const { data } = await api.get("/aule");
    return data;
}

async function fetchLezioni(params = {}) {
    const { data } = await api.get("/lezioni", { params });
    return data;
}

export function useMaterie() {
    return useQuery({
        queryKey: ["materie"],
        queryFn: fetchMaterie,
    });
}

export function useAule() {
    return useQuery({
        queryKey: ["aule"],
        queryFn: fetchAule,
    });
}

export function useLezioni(params = {}) {
    return useQuery({
        queryKey: ["lezioni", params],
        queryFn: () => fetchLezioni(params),
    });
}
