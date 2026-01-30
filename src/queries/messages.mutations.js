import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { api } from "../api/apiClient.js";
import { getErrorMessage } from "../utils/error.js";

export function useSendMessage() {
    const queryClient = useQueryClient();
    const [messageApi] = message.useMessage();

    return useMutation({
        mutationKey: ["sendMessage"],
        mutationFn: async ({ senderId, receiverId, content }) => {
            const res = await api.post(`/messages/send/${senderId}`, {
                receiverId,
                content,
            });
            return res.data;
        },
        onSuccess: (_, variables) => {
            messageApi.success("Messaggio inviato");
            queryClient.invalidateQueries({
                queryKey: ["receivedMessages", variables.receiverId],
            });
        },
        onError: (err) => {
            messageApi.error(getErrorMessage(err, "Errore invio messaggio"));
        },
    });
}
