import {useMutation, useQuery} from "@tanstack/react-query";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/it";

axios.defaults.baseURL = "http://localhost:8080";
dayjs.locale("it");

// Helpers
const fmt = (iso) =>
    iso ? dayjs(iso).format("DD MMM YYYY, HH:mm") : undefined;

// Mapping DTO → UI
const toUiClub = (c) => ({
    id: String(c.id),
    name: c.nome,
    description: c.descrizione,
});

const toUiClubDetail = (d) => ({
    id: String(d.id),
    name: d.nome,
    description: d.descrizione,
    founder: d.fondatoreUsername,
    seatsLeft: d.postiDisponibili,
    createdAt: d.dataCreazione,
    createdAtPretty: fmt(d.dataCreazione),
    members: Array.isArray(d.membri)
        ? d.membri.map((m) => ({ id: String(m.id), username: m.username }))
        : [],
});

// API calls
async function fetchClubs() {
    const res = await axios.get("/api/club/getAllClubs");
    return Array.isArray(res.data) ? res.data.map(toUiClub) : [];
}

async function fetchClub(id) {
    const res = await axios.get(`/api/club/${id}`);
    return toUiClubDetail(res.data);
}

// React Query hooks
export function useClubs() {
    return useQuery({
        queryKey: ["clubs"],
        queryFn: fetchClubs,
    });
}

export function useClub(id) {
    return useQuery({
        queryKey: ["club", id],
        queryFn: () => fetchClub(id),
        enabled: !!id,
    });
}

export function useJoinClub() {
    return useMutation({
        mutationKey: ["joinClub"],
        mutationFn: async ({ clubId, userId }) => {
            const res = await axios.post(`/api/club/${clubId}/iscrivi/${userId}`);
            return res.data;
        },
    });
}

export function useLeaveClub() {
    return useMutation({
        mutationKey: ["leaveClub"],
        mutationFn: async ({ clubId, userId }) => {
            const res = await axios.post(`/api/club/${clubId}/disiscrivi/${userId}`);
            return res.data;
        },
    });
}

