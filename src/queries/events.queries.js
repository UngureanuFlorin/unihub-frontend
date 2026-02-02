import { useQuery } from "@tanstack/react-query";
import { api } from "../api/apiClient.js";

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

function mapEventToUi(dto) {
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

function mapEventDetailToUi(dto) {
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
        userIscritto: dto.userIscritto ?? false,
        attendees: Array.isArray(dto.iscritti)
            ? dto.iscritti.map((u) => ({
                id: String(u.id),
                username: u.username,
                profileImage: u.profileImage || null,
            }))
            : [],
    };
}

function cleanParams(filters) {
    return Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== "" && value !== null && value !== undefined)
    );
}

export async function fetchEvents(filters = {}) {
    const res = await api.get("/eventi/search", { params: cleanParams(filters) });
    return Array.isArray(res.data) ? res.data.map(mapEventToUi) : [];
}

export async function fetchEvent(id) {
    let userId = null;
    try {
        userId = JSON.parse(localStorage.getItem("user"))?.id ?? null;
    } catch {
        userId = null;
    }
    const res = await api.get(`/eventi/${id}`, { params: userId ? { userId } : {} });
    return mapEventDetailToUi(res.data);
}

export function useEvents(filters = {}) {
    return useQuery({
        queryKey: ["events", filters],
        queryFn: () => fetchEvents(filters),
        keepPreviousData: true,
    });
}

export function useEvent(id) {
    return useQuery({
        queryKey: ["event", id],
        queryFn: () => fetchEvent(id),
        enabled: Boolean(id),
    });
}
