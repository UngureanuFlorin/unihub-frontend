import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/apiClient.js";

export function useUpdateUserProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ userId, payload }) => {
            const { data } = await api.put(`/users/${userId}`, payload);
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["user-profile"] });
        },
    });
}

export function useUploadProfileImage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ userId, file }) => {
            const formData = new FormData();
            formData.append("file", file);
            const { data } = await api.post(`/users/${userId}/profile-image`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user-profile"] });
        },
    });
}
