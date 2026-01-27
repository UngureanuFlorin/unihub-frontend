import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/apiClient.js";
import { message as antdMessage } from "antd";
import { getErrorMessage } from "../utils/error.js";

export const useSendMessage = () => {
    const qc = useQueryClient();
    const [msgApi] = antdMessage.useMessage();

    const mutation = useMutation({
        mutationKey: ["sendMessage"],
        mutationFn: async ({ senderId, receiverId, content }) => {
            const res = await api.post(`/messages/send/${senderId}`, {
                receiverId,
                content
            });
            return res.data;
        },
        onSuccess: (data, variables) => {
            msgApi.success("Messaggio inviato!");
            qc.invalidateQueries(["receivedMessages", variables.receiverId]);
        },
        onError: (err) => {
            msgApi.error(getErrorMessage(err, "Errore invio messaggio"));
        },
    });

    return mutation;
};
