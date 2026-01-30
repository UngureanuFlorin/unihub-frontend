import { useMemo } from "react";
import { Button, Card, Table, Tag, Typography, message } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/apiClient.js";
import useAuth from "../hooks/useAuth.js";

const { Text } = Typography;

const STATUS_COLOR = {
    SENT: "blue",
    DELIVERED: "gold",
    READ: "green",
};

export default function Inbox() {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const [messageApi, contextHolder] = message.useMessage();

    const userId = user?.id;

    const { data: messages = [], isLoading, error } = useQuery({
        queryKey: ["receivedMessages", userId],
        enabled: !!userId,
        queryFn: async () => {
            const res = await api.get(`/messages/received/${userId}`);
            return res.data;
        },
    });

    const markAsReadMutation = useMutation({
        mutationFn: async (messageId) => {
            const res = await api.post(`/messages/read/${messageId}`);
            return res.data;
        },
        onSuccess: () => {
            messageApi.success("Messaggio segnato come letto");
            queryClient.invalidateQueries({ queryKey: ["receivedMessages", userId] });
        },
        onError: (err) => {
            messageApi.error(err.response?.data || "Errore aggiornamento stato");
        },
    });

    const columns = useMemo(
        () => [
            {
                title: "Mittente",
                dataIndex: "senderUsername",
                render: (value) => <Text>@{value}</Text>,
            },
            {
                title: "Contenuto",
                dataIndex: "content",
            },
            {
                title: "Stato",
                dataIndex: "status",
                render: (value) => <Tag color={STATUS_COLOR[value]}>{value}</Tag>,
                width: 120,
            },
            {
                title: "Data",
                dataIndex: "createdAt",
                render: (value) => new Date(value).toLocaleString(),
                width: 160,
            },
            {
                title: "Azione",
                render: (_, record) =>
                    record.status !== "READ" ? (
                        <Button
                            size="small"
                            type="primary"
                            onClick={() => markAsReadMutation.mutate(record.id)}
                            loading={markAsReadMutation.isPending}
                        >
                            Segna come letto
                        </Button>
                    ) : null,
                width: 150,
            },
        ],
        [markAsReadMutation]
    );

    const emptyText = error
        ? `Errore: ${error.message || "Problema nel caricamento"}`
        : "Nessun messaggio";

    return (
        <div style={{ padding: 24 }}>
            {contextHolder}

            <Card title="Inbox" style={{ marginBottom: 16, borderRadius: 16 }}>
                <Table
                    rowKey="id"
                    loading={isLoading}
                    columns={columns}
                    dataSource={messages}
                    pagination={{ pageSize: 10 }}
                    locale={{ emptyText }}
                />
            </Card>
        </div>
    );
}
