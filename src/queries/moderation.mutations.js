import { useMutation } from "@tanstack/react-query";
import { api } from "../api/apiClient.js";

function getStoredUserId() {
    try {
        return JSON.parse(localStorage.getItem("user"))?.id ?? null;
    } catch {
        return null;
    }
}

export function useDeleteCommentModeration() {
    return useMutation({
        mutationKey: ["moderation-delete-comment"],
        mutationFn: async (commentId) => {
            const actorId = getStoredUserId();
            const res = await api.delete(`/moderation/comments/${commentId}`, {
                params: actorId ? { actorId } : {},
            });
            return res.data;
        },
    });
}

export function useHideEventModeration() {
    return useMutation({
        mutationKey: ["moderation-hide-event"],
        mutationFn: async (eventId) => {
            const actorId = getStoredUserId();
            const res = await api.post(`/moderation/events/${eventId}/hide`, null, {
                params: actorId ? { actorId } : {},
            });
            return res.data;
        },
    });
}

export function useRestoreEventModeration() {
    return useMutation({
        mutationKey: ["moderation-restore-event"],
        mutationFn: async (eventId) => {
            const actorId = getStoredUserId();
            const res = await api.post(`/moderation/events/${eventId}/restore`, null, {
                params: actorId ? { actorId } : {},
            });
            return res.data;
        },
    });
}

export function useSuspendClubModeration() {
    return useMutation({
        mutationKey: ["moderation-suspend-club"],
        mutationFn: async (clubId) => {
            const actorId = getStoredUserId();
            const res = await api.post(`/moderation/clubs/${clubId}/suspend`, null, {
                params: actorId ? { actorId } : {},
            });
            return res.data;
        },
    });
}

export function useRestoreClubModeration() {
    return useMutation({
        mutationKey: ["moderation-restore-club"],
        mutationFn: async (clubId) => {
            const actorId = getStoredUserId();
            const res = await api.post(`/moderation/clubs/${clubId}/restore`, null, {
                params: actorId ? { actorId } : {},
            });
            return res.data;
        },
    });
}
