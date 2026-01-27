import React, { useMemo } from "react";
import { Table, Button, Space, Tag, Typography, message, Card } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

    // 🔹 query solo se userId è valido
    const { data: messages = [], isLoading, error } = useQuery({
        queryKey: ["receivedMessages", userId],
        queryFn: async () => {
            const res = await api.get(`/messages/received/${userId}`);
            return res.data;
        },
        enabled: !!userId,
    });

    // 🔹 mutation per segnare come letto
    const markAsRead = useMutation({
        mutationFn: async (messageId) => {
            const res = await api.post(`/messages/read/${messageId}`);
            return res.data;
        },
        onSuccess: () => {
            messageApi.success("Messaggio segnato come letto");
            queryClient.invalidateQueries(["receivedMessages", userId]);
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
                dataIndex: "action",
                render: (_, record) =>
                    record.status !== "READ" ? (
                        <Button
                            size="small"
                            type="primary"
                            onClick={() => markAsRead.mutate(record.id)}
                        >
                            Segna come letto
                        </Button>
                    ) : null,
                width: 150,
            },
        ],
        [markAsRead]
    );

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
                    locale={{
                        emptyText: error
                            ? `Errore: ${error.message || "Problema nel caricamento"}`
                            : "Nessun messaggio",
                    }}
                />
            </Card>
        </div>
    );
}
