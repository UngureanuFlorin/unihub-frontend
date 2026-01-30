import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../api/apiClient.js";

export function useFollowUser() {
    return useMutation({
        mutationKey: ["follow"],
        mutationFn: async ({ followerId, seguitoId }) => {
            const res = await api.post(`/follow/${followerId}/segui/${seguitoId}`);
            return res.data;
        },
    });
}

export function useUnfollowUser() {
    return useMutation({
        mutationKey: ["unfollow"],
        mutationFn: async ({ followerId, seguitoId }) => {
            const res = await api.delete(`/follow/${followerId}/unfollow/${seguitoId}`);
            return res.data;
        },
    });
}

export function useFollowStatus(followerId, seguitoId) {
    const enabled = Boolean(followerId && seguitoId);

    return useQuery({
        queryKey: ["follow-status", followerId, seguitoId],
        queryFn: async () => {
            const res = await api.get(`/follow/${followerId}/status/${seguitoId}`);
            return res.data;
        },
        enabled,
    });
}
