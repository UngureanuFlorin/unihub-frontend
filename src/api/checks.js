import { api } from "./apiClient.js";

export async function checkUsername(username) {
    const { data } = await api.get("/auth/check-username", { params: { username } });
    // data è già true/false
    return Boolean(data);
}

export async function checkEmail(email) {
    const { data } = await api.get("/auth/check-email", { params: { email } });
    return Boolean(data);
}
