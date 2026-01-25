import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../api/apiClient.js";

export function useFollowUser() {
    return useMutation({
        mutationKey: ["follow"],
        mutationFn: ({ followerId, seguitoId }) =>
            api.post(`/follow/${followerId}/segui/${seguitoId}`).then(r => r.data),
    });
}

export function useUnfollowUser() {
    return useMutation({
        mutationKey: ["unfollow"],
        mutationFn: ({ followerId, seguitoId }) =>
            api.delete(`/follow/${followerId}/unfollow/${seguitoId}`).then(r => r.data),
    });
}

export function useFollowStatus(followerId, seguitoId) {
    return useQuery({
        queryKey: ["follow-status", followerId, seguitoId],
        queryFn: () =>
            api.get(`/follow/${followerId}/status/${seguitoId}`).then(r => r.data),
        enabled: Boolean(followerId && seguitoId),
    });
}
