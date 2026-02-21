import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/apiClient.js";

export function useSaveEventBookmark() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["save-event-bookmark"],
        mutationFn: async ({ eventId, userId }) => {
            const { data } = await api.post(`/bookmarks/events/${eventId}`, null, {
                params: { userId },
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["saved-events"] });
            queryClient.invalidateQueries({ queryKey: ["events"] });
        },
    });
}

export function useRemoveEventBookmark() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["remove-event-bookmark"],
        mutationFn: async ({ eventId, userId }) => {
            const { data } = await api.delete(`/bookmarks/events/${eventId}`, {
                params: { userId },
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["saved-events"] });
            queryClient.invalidateQueries({ queryKey: ["events"] });
        },
    });
}

export function useSavePostBookmark() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["save-post-bookmark"],
        mutationFn: async ({ postId, userId }) => {
            const { data } = await api.post(`/bookmarks/posts/${postId}`, null, {
                params: { userId },
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["saved-posts"] });
            queryClient.invalidateQueries({ queryKey: ["feed-posts"] });
        },
    });
}

export function useRemovePostBookmark() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["remove-post-bookmark"],
        mutationFn: async ({ postId, userId }) => {
            const { data } = await api.delete(`/bookmarks/posts/${postId}`, {
                params: { userId },
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["saved-posts"] });
            queryClient.invalidateQueries({ queryKey: ["feed-posts"] });
        },
    });
}
