import { useMutation } from "@tanstack/react-query";
import { api } from "../api/apiClient.js";

export function useDeleteCommentModeration() {
    return useMutation({
        mutationKey: ["moderation-delete-comment"],
        mutationFn: async (commentId) => {
            const res = await api.delete(`/moderation/comments/${commentId}`);
            return res.data;
        },
    });
}

export function useHideEventModeration() {
    return useMutation({
        mutationKey: ["moderation-hide-event"],
        mutationFn: async (eventId) => {
            const res = await api.post(`/moderation/events/${eventId}/hide`);
            return res.data;
        },
    });
}

export function useSuspendClubModeration() {
    return useMutation({
        mutationKey: ["moderation-suspend-club"],
        mutationFn: async (clubId) => {
            const res = await api.post(`/moderation/clubs/${clubId}/suspend`);
            return res.data;
        },
    });
}

export function useRestoreClubModeration() {
    return useMutation({
        mutationKey: ["moderation-restore-club"],
        mutationFn: async (clubId) => {
            const res = await api.post(`/moderation/clubs/${clubId}/restore`);
            return res.data;
        },
    });
}
