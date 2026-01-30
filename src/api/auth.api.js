import { api } from "./apiClient";

export const loginRequest = (payload) =>
    api.post("/auth/login", payload).then(r => r.data);

export const registerRequest = (payload) =>
    api.post("/auth/register", payload).then(r => r.data);