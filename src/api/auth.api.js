import { api } from "./apiClient";

export const loginRequest = (payload) => {
    console.log("loginRequest payload:", payload);
    return api.post("/auth/login", payload).then(r => {
        console.log("loginRequest response:", r.data);
        return r.data;
    });
};

export const registerRequest = (payload) => api.post("/auth/register", payload).then(r => r.data);
