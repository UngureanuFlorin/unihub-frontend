import { useMemo, useState } from "react";
import { Button, Card, Popconfirm, Select, Space, Table, Tag, Typography, message } from "antd";
import { Link } from "react-router-dom";
import { useReports } from "../queries/reports.queries.js";
import { useUpdateReportStatus } from "../queries/reports.mutations.js";
import { getErrorMessage } from "../utils/error.js";
import {
    useHideEventModeration,
    useRestoreEventModeration,
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
    const [statusFilter, setStatusFilter] = useState("NEW");
    const [typeFilter, setTypeFilter] = useState(undefined);

    const { data: reports = [], isLoading } = useReports({
        status: statusFilter,
        type: typeFilter,
    });

    const updateStatusMutation = useUpdateReportStatus();
    const hideEventMutation = useHideEventModeration();
    const restoreEventMutation = useRestoreEventModeration();
    const suspendClubMutation = useSuspendClubModeration();
    const restoreClubMutation = useRestoreClubModeration();

    const [messageApi, contextHolder] = message.useMessage();
    const resolveReport = async (reportId) => {
        await updateStatusMutation.mutateAsync({ reportId, status: "RESOLVED" });
    };

    const updateReportStatus = async (reportId, nextStatus) => {
        try {
            await updateStatusMutation.mutateAsync({ reportId, status: nextStatus });
            messageApi.success("Stato aggiornato");
        } catch (err) {
            messageApi.error(getErrorMessage(err, "Errore aggiornamento stato"));
        }
    };

    const renderTarget = (record) => {
        if (record.targetType === "EVENT") {
            const label = record.targetSummary;

            return (
                <Space size="small">
                    {record.targetHidden ? <Text>{label}</Text> : <Link to={`/events/${record.targetId}`}>{label}</Link>}
                    {record.targetHidden && <Tag color="volcano">Nascosto</Tag>}
                </Space>
            );
        }

        if (record.targetType === "CLUB") {
            const label = record.targetSummary;

            return (
                <Space size="small">
                    {record.targetSuspended ? (
                        <Text>{label}</Text>
                    ) : (
                        <Link to={`/clubs/${record.targetId}`}>{label}</Link>
                    )}
                    {record.targetSuspended && <Tag color="volcano">Sospeso</Tag>}
                </Space>
            );
        }

        return <Text>{record.targetSummary}</Text>;
    };

    const columns = useMemo(
        () => [
            {
                title: "Tipo",
                dataIndex: "targetType",
                width: 100,
                render: (value) => <Tag>{value}</Tag>,
            },
            {
                title: "Target",
                dataIndex: "targetSummary",
                render: (_, record) => renderTarget(record),
            },
            {
                title: "Reporter",
                dataIndex: "reporter",
                width: 160,
                render: (value) => <Text>@{value?.username}</Text>,
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
                width: 120,
                render: (value) => <Tag color={STATUS_COLOR[value]}>{value}</Tag>,
            },
            {
                title: "Azione",
                width: 260,
                render: (_, record) => (
                    <Space>
                        <Select
                            size="small"
                            value={record.status}
                            options={STATUS_OPTIONS}
                            onChange={(next) => updateReportStatus(record.id, next)}
                            style={{ width: 120 }}
                        />

                        {record.targetType === "EVENT" && (
                            <Popconfirm
                                title={record.targetHidden ? "Ripristinare questo evento?" : "Oscurare questo evento?"}
                                description={
                                    record.targetHidden
                                        ? "L'evento tornera' visibile nel feed pubblico."
                                        : "L'evento non sara' piu' visibile nel feed pubblico."
                                }
                                okText="Conferma"
                                cancelText="Annulla"
                                onConfirm={async () => {
                                    try {
                                        if (record.targetHidden) {
                                            await restoreEventMutation.mutateAsync(record.targetId);
                                            messageApi.success("Evento ripristinato");
                                        } else {
                                            await hideEventMutation.mutateAsync(record.targetId);
                                            messageApi.success("Evento oscurato");
                                        }
                                        await resolveReport(record.id);
                                    } catch (err) {
                                        messageApi.error(getErrorMessage(err, "Errore oscuramento evento"));
                                    }
                                }}
                            >
                                <Button size="small">{record.targetHidden ? "Ripristina" : "Oscura"}</Button>
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
                                            await restoreClubMutation.mutateAsync(record.targetId);
                                            messageApi.success("Club ripristinato");
                                        } else {
                                            await suspendClubMutation.mutateAsync(record.targetId);
                                            messageApi.success("Club sospeso");
                                        }

                                        await resolveReport(record.id);
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
        [
            hideEventMutation,
            messageApi,
            restoreEventMutation,
            restoreClubMutation,
            suspendClubMutation,
            updateStatusMutation,
            statusFilter,
            typeFilter,
        ]
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
                                value={statusFilter}
                                options={STATUS_OPTIONS}
                                onChange={setStatusFilter}
                                style={{ width: 160 }}
                            />
                            <Select
                                allowClear
                                placeholder="Tipo"
                                value={typeFilter}
                                options={TYPE_OPTIONS}
                                onChange={setTypeFilter}
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
