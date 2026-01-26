export function getErrorMessage(error, fallback = "Errore") {
    const data = error?.response?.data;
    if (!data) return fallback;
    if (typeof data === "string") return data;
    if (typeof data === "object") return data.message || data.error || JSON.stringify(data);
    return String(data);
}
