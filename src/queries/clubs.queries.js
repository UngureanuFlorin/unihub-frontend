import { useMutation, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/it";
import { api } from "../api/apiClient.js";

dayjs.locale("it");

const formatDateTime = (iso) => (iso ? dayjs(iso).format("DD MMM YYYY, HH:mm") : undefined);

const mapClubToUi = (club) => ({
    id: String(club.id),
    name: club.nome,
    description: club.descrizione,
});

const mapClubDetailToUi = (detail) => ({
    id: String(detail.id),
    name: detail.nome,
    description: detail.descrizione,
    founder: detail.fondatoreUsername,
    seatsLeft: detail.postiDisponibili,
    createdAt: detail.dataCreazione,
    createdAtPretty: formatDateTime(detail.dataCreazione),
    members: Array.isArray(detail.membri)
        ? detail.membri.map((member) => ({
            id: String(member.id),
            username: member.username,
        }))
        : [],
});

async function getClubs() {
    const res = await api.get("/club/getAllClubs");
    return Array.isArray(res.data) ? res.data.map(mapClubToUi) : [];
}

async function getClub(id) {
    const res = await api.get(`/club/${id}`);
    return mapClubDetailToUi(res.data);
}

export function useClubs() {
    return useQuery({
        queryKey: ["clubs"],
        queryFn: getClubs,
    });
}

export function useClub(id) {
    return useQuery({
        queryKey: ["club", id],
        queryFn: () => getClub(id),
        enabled: Boolean(id),
    });
}

export function useJoinClub() {
    return useMutation({
        mutationKey: ["joinClub"],
        mutationFn: async ({ clubId, userId }) => {
            const res = await api.post(`/club/${clubId}/iscrivi/${userId}`);
            return res.data;
        },
    });
}

export function useLeaveClub() {
    return useMutation({
        mutationKey: ["leaveClub"],
        mutationFn: async ({ clubId, userId }) => {
            const res = await api.post(`/club/${clubId}/disiscrivi/${userId}`);
            return res.data;
        },
    });
}
