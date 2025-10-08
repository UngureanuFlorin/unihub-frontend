import { useMutation } from "@tanstack/react-query";
import { api } from "../api/apiClient";

export function useLogin() {
    return useMutation({
        mutationFn: async (data) => {
            const res = await api.post("/auth/login", data); // <-- il tuo endpoint
            return res.data;
        },
    });
}

export function useRegister() {
    return useMutation({
        mutationFn: async (data) => {
            const res = await api.post("/auth/register", data);
            return res.data;
        },
    });
}
