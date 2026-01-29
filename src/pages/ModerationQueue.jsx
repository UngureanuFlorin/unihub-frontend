import React, { useMemo, useState } from "react";
import { Button, Card, Popconfirm, Select, Space, Table, Tag, Typography, message } from "antd";
import { Link } from "react-router-dom";
import { useReports } from "../queries/reports.queries.js";
import { useUpdateReportStatus } from "../queries/reports.mutations.js";
import { getErrorMessage } from "../utils/error.js";
import {
    useHideEventModeration,
    useRestoreClubModeration,
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
    const hideEvent = useHideEventModeration();
    const suspendClub = useSuspendClubModeration();
    const restoreClub = useRestoreClubModeration();
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
                        const clubLabel = record.targetSummary;
                        return (
                            <Space size="small">
                                {record.targetSuspended ? (
                                    <Text>{clubLabel}</Text>
                                ) : (
                                    <Link to={`/clubs/${record.targetId}`}>{clubLabel}</Link>
                                )}
                                {record.targetSuspended && <Tag color="volcano">Sospeso</Tag>}
                            </Space>
                        );
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
                        {record.targetType === "EVENT" && (
                            <Popconfirm
                                title="Oscurare questo evento?"
                                description="L'evento non sara' piu' visibile nel feed pubblico."
                                okText="Conferma"
                                cancelText="Annulla"
                                onConfirm={async () => {
                                    try {
                                        await hideEvent.mutateAsync(record.targetId);
                                        await handleResolve(record.id);
                                        messageApi.success("Evento oscurato");
                                    } catch (err) {
                                        messageApi.error(getErrorMessage(err, "Errore oscuramento evento"));
                                    }
                                }}
                            >
                                <Button size="small">Oscura</Button>
                            </Popconfirm>
                        )}
                        {record.targetType === "CLUB" && (
                            <Popconfirm
                                title={record.targetSuspended ? "Ripristinare questo club?" : "Sospendere questo club?"}
                                description={
                                    record.targetSuspended
                                        ? "Il club tornera' visibile nelle liste pubbliche."
                                        : "Il club non sara' piu' visibile nelle liste pubbliche."
                                }
                                okText="Conferma"
                                cancelText="Annulla"
                                onConfirm={async () => {
                                    try {
                                        if (record.targetSuspended) {
                                            await restoreClub.mutateAsync(record.targetId);
                                            messageApi.success("Club ripristinato");
                                        } else {
                                            await suspendClub.mutateAsync(record.targetId);
                                            messageApi.success("Club sospeso");
                                        }
                                        await handleResolve(record.id);
                                    } catch (err) {
                                        messageApi.error(getErrorMessage(err, "Errore azione club"));
                                    }
                                }}
                            >
                                <Button size="small">
                                    {record.targetSuspended ? "Ripristina" : "Sospendi"}
                                </Button>
                            </Popconfirm>
                        )}
                    </Space>
                ),
            },
        ],
        [hideEvent, messageApi, restoreClub, suspendClub, updateStatus]
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
