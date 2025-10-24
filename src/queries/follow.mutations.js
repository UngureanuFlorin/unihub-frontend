import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
axios.defaults.baseURL = "http://localhost:8080";

export function useFollowUser() {
    return useMutation({
        mutationKey: ["follow"],
        mutationFn: ({ followerId, seguitoId }) =>
            axios.post(`/api/follow/${followerId}/segui/${seguitoId}`).then(r => r.data),
    });
}

export function useUnfollowUser() {
    return useMutation({
        mutationKey: ["unfollow"],
        mutationFn: ({ followerId, seguitoId }) =>
            axios.delete(`/api/follow/${followerId}/unfollow/${seguitoId}`).then(r => r.data),
    });
}

export function useFollowStatus(followerId, seguitoId) {
    return useQuery({
        queryKey: ["follow-status", followerId, seguitoId],
        queryFn: () =>
            axios.get(`/api/follow/${followerId}/status/${seguitoId}`).then(r => r.data),
        enabled: Boolean(followerId && seguitoId),
    });
}
