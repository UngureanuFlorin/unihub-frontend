import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";

// Imposta la base URL del backend
axios.defaults.baseURL = "http://localhost:8080";

/* ================================
   🔹 Formattazione date
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
   🔹 Mapping DTO → UI shape
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
        endDatePretty: formatPretty(dto.dataFine),
        place: dto.luogo,
        organizer: dto.creatore?.username,
        slotsTotal: dto.postiTotali,
        slotsLeft: dto.postiDisponibili,
        deadlinePretty: formatPretty(dto.deadlineIscrizione),
        average: 0,
        comments: [],
    };
}

/* ================================
   🔹 Fetch API
================================ */
export async function fetchEventsPage({ page = 0, size = 9 }) {
    const res = await axios.get("/api/eventi", { params: { page, size } });
    const data = res.data;

    // Caso: Spring restituisce Page<EventoDTO>
    if (data && typeof data === "object" && data.content) {
        const items = data.content.map(toUiEvent);
        const nextPage = data.last ? undefined : data.number + 1;
        return { items, nextPage };
    }

    // Caso: semplice array
    if (Array.isArray(data)) {
        const all = data.map(toUiEvent);
        const start = page * size;
        const slice = all.slice(start, start + size);
        const hasNext = start + size < all.length;
        return { items: slice, nextPage: hasNext ? page + 1 : undefined };
    }

    return { items: [], nextPage: undefined };
}

export async function fetchEvent(id) {
    const res = await axios.get(`/api/eventi/${id}`);
    return toUiEventDetail(res.data);
}

/* ================================
   🔹 React Query hooks
================================ */
export function useInfiniteEvents(filters = {}) {
    return useInfiniteQuery({
        queryKey: ["events", filters],
        queryFn: ({ pageParam = 0 }) =>
            fetchEventsPage({ page: pageParam, size: 9, ...filters }),
        getNextPageParam: (last) => last.nextPage,
    });
}

export function useEvent(id) {
    return useQuery({
        queryKey: ["event", id],
        queryFn: () => fetchEvent(id),
        enabled: !!id,
    });
}
