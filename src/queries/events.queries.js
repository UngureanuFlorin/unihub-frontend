import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { api } from "../api/apiClient.js";

/* ================================
   🕒 Utility: formattazione date
================================ */
function formatPretty(iso) {
    if (!iso) return undefined;
    return new Date(iso).toLocaleString("it-IT", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatRaw(iso) {
    if (!iso) return undefined;
    return new Date(iso).toISOString().slice(0, 16).replace("T", " ");
}

/* ================================
   🔁 Mapping DTO → UI shape
================================ */
function toUiEvent(dto) {
    return {
        id: String(dto.id),
        title: dto.titolo,
        summary: dto.descrizione,
        description: dto.descrizione,
        date: formatRaw(dto.dataInizio),
        datePretty: formatPretty(dto.dataInizio),
        place: dto.luogo,
        organizer: dto.creatore?.username,
    };
}

function toUiEventDetail(dto) {
    return {
        id: String(dto.id),
        title: dto.titolo,
        summary: dto.descrizione,
        description: dto.descrizione,
        date: formatRaw(dto.dataInizio),
        datePretty: formatPretty(dto.dataInizio),
        endDate: formatRaw(dto.dataFine),
        endDatePretty: formatPretty(dto.dataFine),
        place: dto.luogo,
        organizer: dto.creatore?.username,
        slotsTotal: dto.postiTotali,
        slotsLeft: dto.postiDisponibili,
        deadlinePretty: formatPretty(dto.deadlineIscrizione),
        average: 0,
        comments: [],
        userIscritto: dto.userIscritto ?? false, // boolean dal backend
        attendees: Array.isArray(dto.iscritti)
            ? dto.iscritti.map((u) => ({
                id: String(u.id),
                username: u.username,
                profileImage: u.profileImage || null,
            }))
            : [],
    };
}
export async function fetchEvents(filters = {}) {
    // pulizia: togli chiavi vuote/null per non sporcare la querystring
    const params = Object.fromEntries(
        Object.entries(filters).filter(
            ([, v]) => v !== "" && v !== null && v !== undefined
        )
    );

    // NB: se apiClient ha baseURL già con /api, qui basta "/eventi/search"
    const res = await api.get("/eventi/search", { params });

    // backend ritorna array di DTO
    if (Array.isArray(res.data)) return res.data.map(toUiEvent);

    // fallback (se per sbaglio arriva altro)
    return [];
}

// 🔹 Recupera un singolo evento per ID (DETTAGLIO)
export async function fetchEvent(id) {
    // ✅ niente più params username → chiamata pulita
    const res = await api.get(`/eventi/${id}`);
    return toUiEventDetail(res.data);
}

/* ================================
   🎣 React Query hooks
================================ */

// 🔹 Hook per lista con infinite scroll
export function useEvents(filters = {}) {
    return useQuery({
        queryKey: ["events", filters],
        queryFn: () => fetchEvents(filters),
        keepPreviousData: true,
    });
}

// 🔹 Hook per dettaglio evento
export function useEvent(id) {
    return useQuery({
        queryKey: ["event", id],
        queryFn: () => fetchEvent(id),
        enabled: !!id, // attiva solo se l'id esiste
    });
}
