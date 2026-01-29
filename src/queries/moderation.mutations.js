import { useMutation } from "@tanstack/react-query";
import { api } from "../api/apiClient.js";

export function useDeleteCommentModeration() {
    return useMutation({
        mutationKey: ["moderation-delete-comment"],
        mutationFn: async (commentId) => {
            const { data } = await api.delete(`/moderation/comments/${commentId}`);
            return data;
        },
    });
}

export function useHideEventModeration() {
    return useMutation({
        mutationKey: ["moderation-hide-event"],
        mutationFn: async ({ eventId, actorId }) => {
            const { data } = await api.post(`/moderation/events/${eventId}/hide`, null, {
                params: { actorId },
            });
            return data;
        },
    });
}

export function useRestoreEventModeration() {
    return useMutation({
        mutationKey: ["moderation-restore-event"],
        mutationFn: async ({ eventId, actorId }) => {
            const { data } = await api.post(`/moderation/events/${eventId}/restore`, null, {
                params: { actorId },
            });
            return data;
        },
    });
}

export function useSuspendClubModeration() {
    return useMutation({
        mutationKey: ["moderation-suspend-club"],
        mutationFn: async ({ clubId, actorId }) => {
            const { data } = await api.post(`/moderation/clubs/${clubId}/suspend`, null, {
                params: { actorId },
            });
            return data;
        },
    });
}

export function useRestoreClubModeration() {
    return useMutation({
        mutationKey: ["moderation-restore-club"],
        mutationFn: async ({ clubId, actorId }) => {
            const { data } = await api.post(`/moderation/clubs/${clubId}/restore`, null, {
                params: { actorId },
            });
            return data;
        },
    });
}
