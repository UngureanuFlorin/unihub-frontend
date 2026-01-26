import React, { useMemo, useState } from "react";
import { Button, Card, Select, Space, Table, Tag, Typography, message } from "antd";
import { Link } from "react-router-dom";
import { useReports } from "../queries/reports.queries.js";
import { useUpdateReportStatus } from "../queries/reports.mutations.js";
import { getErrorMessage } from "../utils/error.js";
import {
    useDeleteCommentModeration,
    useHideEventModeration,
    useSuspendClubModeration,
} from "../queries/moderation.mutations.js";

const { Title, Text } = Typography;

const STATUS_OPTIONS = [
    { label: "Nuove", value: "NEW" },
    { label: "In revisione", value: "IN_REVIEW" },
    { label: "Risolte", value: "RESOLVED" },
    { label: "Scartate", value: "REJECTED" },
];

const TYPE_OPTIONS = [
    { label: "Eventi", value: "EVENT" },
    { label: "Commenti", value: "COMMENT" },
    { label: "Club", value: "CLUB" },
];

const STATUS_COLOR = {
    NEW: "red",
    IN_REVIEW: "gold",
    RESOLVED: "green",
    REJECTED: "default",
};

export default function ModerationQueue() {
    const [status, setStatus] = useState("NEW");
    const [type, setType] = useState(undefined);
    const { data: reports = [], isLoading } = useReports({ status, type });
    const updateStatus = useUpdateReportStatus();
    const deleteComment = useDeleteCommentModeration();
    const hideEvent = useHideEventModeration();
    const suspendClub = useSuspendClubModeration();
    const [messageApi, contextHolder] = message.useMessage();

    const handleResolve = async (reportId) => {
        await updateStatus.mutateAsync({ reportId, status: "RESOLVED" });
    };

    const columns = useMemo(
        () => [
            {
                title: "Tipo",
                dataIndex: "targetType",
                render: (value) => <Tag>{value}</Tag>,
                width: 100,
            },
            {
                title: "Target",
                dataIndex: "targetSummary",
                render: (_, record) => {
                    if (record.targetType === "EVENT") {
                        return <Link to={`/events/${record.targetId}`}>{record.targetSummary}</Link>;
                    }
                    if (record.targetType === "CLUB") {
                        return <Link to={`/clubs/${record.targetId}`}>{record.targetSummary}</Link>;
                    }
                    return <Text>{record.targetSummary}</Text>;
                },
            },
            {
                title: "Reporter",
                dataIndex: "reporter",
                render: (value) => <Text>@{value?.username}</Text>,
                width: 160,
            },
            {
                title: "Motivo",
                dataIndex: "reason",
            },
            {
                title: "Dettagli",
                dataIndex: "details",
                render: (value) => value || "-",
            },
            {
                title: "Stato",
                dataIndex: "status",
                render: (value) => <Tag color={STATUS_COLOR[value]}>{value}</Tag>,
                width: 120,
            },
            {
                title: "Azione",
                dataIndex: "action",
                width: 260,
                render: (_, record) => (
                    <Space>
                        <Select
                            size="small"
                            value={record.status}
                            options={STATUS_OPTIONS}
                            onChange={async (next) => {
                                try {
                                    await updateStatus.mutateAsync({
                                        reportId: record.id,
                                        status: next,
                                    });
                                    messageApi.success("Stato aggiornato");
                                } catch (err) {
                                    messageApi.error(getErrorMessage(err, "Errore aggiornamento stato"));
                                }
                            }}
                            style={{ width: 120 }}
                        />
                        {record.targetType === "COMMENT" && (
                            <Button
                                size="small"
                                danger
                                onClick={async () => {
                                    try {
                                        await deleteComment.mutateAsync(record.targetId);
                                        await handleResolve(record.id);
                                        messageApi.success("Commento eliminato");
                                    } catch (err) {
                                        messageApi.error(getErrorMessage(err, "Errore eliminazione commento"));
                                    }
                                }}
                            >
                                Elimina
                            </Button>
                        )}
                        {record.targetType === "EVENT" && (
                            <Button
                                size="small"
                                onClick={async () => {
                                    try {
                                        await hideEvent.mutateAsync(record.targetId);
                                        await handleResolve(record.id);
                                        messageApi.success("Evento nascosto");
                                    } catch (err) {
                                        messageApi.error(getErrorMessage(err, "Errore hide evento"));
                                    }
                                }}
                            >
                                Nascondi
                            </Button>
                        )}
                        {record.targetType === "CLUB" && (
                            <Button
                                size="small"
                                onClick={async () => {
                                    try {
                                        await suspendClub.mutateAsync(record.targetId);
                                        await handleResolve(record.id);
                                        messageApi.success("Club sospeso");
                                    } catch (err) {
                                        messageApi.error(getErrorMessage(err, "Errore sospensione club"));
                                    }
                                }}
                            >
                                Sospendi
                            </Button>
                        )}
                    </Space>
                ),
            },
        ],
        [deleteComment, hideEvent, messageApi, suspendClub, updateStatus]
    );

    return (
        <div style={{ padding: 24 }}>
            {contextHolder}
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <Card>
                    <Space align="center" style={{ justifyContent: "space-between", width: "100%" }}>
                        <Title level={3} style={{ margin: 0 }}>
                            Moderazione
                        </Title>
                        <Space>
                            <Select
                                value={status}
                                options={STATUS_OPTIONS}
                                onChange={setStatus}
                                style={{ width: 160 }}
                            />
                            <Select
                                allowClear
                                placeholder="Tipo"
                                value={type}
                                options={TYPE_OPTIONS}
                                onChange={setType}
                                style={{ width: 140 }}
                            />
                        </Space>
                    </Space>
                </Card>

                <Table
                    rowKey="id"
                    loading={isLoading}
                    columns={columns}
                    dataSource={reports}
                    pagination={{ pageSize: 8 }}
                />
            </Space>
        </div>
    );
}
