import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/apiClient.js";

export function useUpdateUserProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["updateUserProfile"],
        mutationFn: async ({ userId, payload }) => {
            const res = await api.put(`/users/${userId}`, payload);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user-profile"] });
        },
    });
}

export function useUploadProfileImage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["uploadProfileImage"],
        mutationFn: async ({ userId, file }) => {
            const formData = new FormData();
            formData.append("file", file);

            const res = await api.post(`/users/${userId}/profile-image`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user-profile"] });
        },
    });
}
