import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { api } from "../api/apiClient.js";

function getStoredUserId() {
    try {
        return JSON.parse(localStorage.getItem("user"))?.id ?? null;
    } catch {
        return null;
    }
}

function mapUserCardToUi(dto) {
    return {
        id: String(dto.id),
        name: dto.name,
        surname: dto.surname,
        username: dto.username,
        role: dto.role,
        faculty: dto.faculty,
        following: dto.following,
    };
}

async function fetchUsersPage({ pageParam = 0, size = 12, q }) {
    const currentUserId = getStoredUserId();

    const params = {
        currentUserId,
        page: pageParam,
        size,
    };

    if (q && q.trim()) params.q = q.trim();

    const res = await api.get("/users", { params });
    const page = res.data;

    const items = Array.isArray(page?.content) ? page.content.map(mapUserCardToUi) : [];
    const nextPage = page?.last ? undefined : (page?.number ?? 0) + 1;

    return { items, nextPage };
}

export function useInfiniteUsers(filters = {}) {
    return useInfiniteQuery({
        queryKey: ["users", filters],
        queryFn: ({ pageParam = 0 }) => fetchUsersPage({ pageParam, ...filters }),
        getNextPageParam: (lastPage) => lastPage.nextPage,
    });
}

export async function fetchUserProfile(userId, viewerId) {
    const res = await api.get(`/users/${userId}`, { params: { viewerId } });
    return res.data;
}

export function useUserProfile(userId) {
    const viewerId = getStoredUserId();

    return useQuery({
        queryKey: ["user-profile", userId, viewerId],
        queryFn: () => fetchUserProfile(userId, viewerId),
        enabled: Boolean(userId),
    });
}
