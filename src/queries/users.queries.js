import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080";

function toUiUser(card) {
    return {
        id: String(card.id),
        name: card.name,
        surname: card.surname,
        username: card.username,
        role: card.role,
        faculty: card.faculty,
        following: card.following,
    };
}

async function fetchUsersPage({ pageParam = 0, size = 12, q }) {
    const me = JSON.parse(localStorage.getItem("user")); // {id, username, role}
    const params = { currentUserId: me?.id, page: pageParam, size };
    if (q && q.trim()) params.q = q.trim();

    const res = await axios.get("/api/users", { params });
    const data = res.data; // Spring Page<UserCardDTO>

    const items = (data?.content || []).map(toUiUser);
    const nextPage = data?.last ? undefined : (data?.number ?? 0) + 1;

    return { items, nextPage };
}

export function useInfiniteUsers(filters = {}) {
    return useInfiniteQuery({
        queryKey: ["users", filters],
        queryFn: ({ pageParam = 0 }) => fetchUsersPage({ pageParam, ...filters }),
        getNextPageParam: (last) => last.nextPage,
    });
}

export async function fetchUserProfile(userId, viewerId) {
    const res = await axios.get(`/api/users/${userId}`, { params: { viewerId } });
    return res.data;
}

export function useUserProfile(userId) {
    const me = JSON.parse(localStorage.getItem("user")); // { id, username, role }
    return useQuery({
        queryKey: ["user-profile", userId, me?.id],
        queryFn: () => fetchUserProfile(userId, me?.id),
        enabled: !!userId,
    });
}
