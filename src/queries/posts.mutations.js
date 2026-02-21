import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/apiClient.js";

export function useCreatePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["create-post"],
        mutationFn: async ({ userId, payload }) => {
            const { data } = await api.post("/posts", payload, { params: { userId } });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["feed-posts"] });
        },
    });
}

export function useLikePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["like-post"],
        mutationFn: async ({ postId, userId }) => {
            const { data } = await api.post(`/posts/${postId}/like`, null, {
                params: { userId },
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["feed-posts"] });
        },
    });
}

export function useUnlikePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["unlike-post"],
        mutationFn: async ({ postId, userId }) => {
            const { data } = await api.post(`/posts/${postId}/unlike`, null, {
                params: { userId },
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["feed-posts"] });
        },
    });
}

export function useAddPostComment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["add-post-comment"],
        mutationFn: async ({ postId, userId, content }) => {
            const { data } = await api.post(
                `/posts/${postId}/comments`,
                { content },
                { params: { userId } }
            );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["feed-posts"] });
        },
    });
}

export function useDeletePostComment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["delete-post-comment"],
        mutationFn: async ({ postId, commentId, userId }) => {
            const { data } = await api.delete(`/posts/${postId}/comments/${commentId}`, {
                params: { userId },
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["feed-posts"] });
        },
    });
}
