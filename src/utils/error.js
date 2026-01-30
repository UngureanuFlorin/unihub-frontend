export function getErrorMessage(error) {
    if (!error) return "Errore imprevisto";

    if (typeof error === "string") return error;

    if (error.response?.data?.message) {
        return error.response.data.message;
    }

    return "Errore imprevisto";
}