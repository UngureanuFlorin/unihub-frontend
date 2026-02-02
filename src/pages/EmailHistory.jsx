import { useMemo, useState } from "react";
import { Button, Card, Modal, Select, Space, Table, Tag, Typography } from "antd";
import dayjs from "dayjs";
import { useEmailHistory } from "../queries/emailHistory.queries.js";

const { Title, Text } = Typography;

const STATUS_OPTIONS = [
    { label: "Inviate", value: "SENT" },
    { label: "Fallite", value: "FAILED" },
];

const TYPE_OPTIONS = [
    { label: "Welcome", value: "WELCOME" },
    { label: "Support", value: "SUPPORT" },
    { label: "Evento nuovo", value: "EVENT_NEW" },
    { label: "Iscrizione evento", value: "EVENT_SIGNUP" },
    { label: "Evento aggiornato", value: "EVENT_UPDATE" },
    { label: "Commento evento", value: "EVENT_COMMENT" },
    { label: "Generiche", value: "GENERIC" },
];

const STATUS_COLOR = {
    SENT: "green",
    FAILED: "red",
};

export default function EmailHistory() {
    const [statusFilter, setStatusFilter] = useState(undefined);
    const [typeFilter, setTypeFilter] = useState(undefined);
    const [selectedLog, setSelectedLog] = useState(null);

    const { data: logs = [], isLoading } = useEmailHistory({
        status: statusFilter,
        type: typeFilter,
    });

    const columns = useMemo(
        () => [
            {
                title: "Data",
                dataIndex: "createdAt",
                width: 170,
                render: (value) => (value ? dayjs(value).format("DD MMM YYYY, HH:mm") : "-"),
            },
            {
                title: "Destinatario",
                dataIndex: "toEmail",
                width: 220,
                render: (value) => <Text>{value}</Text>,
            },
            {
                title: "Oggetto",
                dataIndex: "subject",
            },
            {
                title: "Tipo",
                dataIndex: "type",
                width: 140,
                render: (value) => <Tag>{value}</Tag>,
            },
            {
                title: "Stato",
                dataIndex: "status",
                width: 120,
                render: (value) => <Tag color={STATUS_COLOR[value]}>{value}</Tag>,
            },
            {
                title: "Errore",
                dataIndex: "errorMessage",
                render: (value) => value || "-",
            },
            {
                title: "Azioni",
                width: 120,
                render: (_, record) => (
                    <Button size="small" onClick={() => setSelectedLog(record)}>
                        Vedi
                    </Button>
                ),
            },
        ],
        []
    );

    const isModalOpen = Boolean(selectedLog);
    const emailBody = selectedLog?.body || "";

    const modalBody =
        selectedLog?.html ? (
            <div
                style={{ background: "#fff", padding: 16, borderRadius: 8 }}
                dangerouslySetInnerHTML={{ __html: emailBody }}
            />
        ) : (
            <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{emailBody}</pre>
        );

    return (
        <div style={{ padding: 24 }}>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <Card>
                    <Space align="center" style={{ justifyContent: "space-between", width: "100%" }}>
                        <Title level={3} style={{ margin: 0 }}>
                            Storico email
                        </Title>

                        <Space>
                            <Select
                                allowClear
                                placeholder="Stato"
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
                                style={{ width: 180 }}
                            />
                        </Space>
                    </Space>
                </Card>

                <Table
                    rowKey="id"
                    loading={isLoading}
                    columns={columns}
                    dataSource={logs}
                    pagination={{ pageSize: 8 }}
                />
            </Space>

            <Modal
                open={isModalOpen}
                title={selectedLog?.subject}
                onCancel={() => setSelectedLog(null)}
                footer={null}
                width={760}
            >
                <Space direction="vertical" size="small" style={{ width: "100%" }}>
                    <Text>
                        <strong>Da:</strong> {selectedLog?.fromEmail}
                    </Text>
                    <Text>
                        <strong>A:</strong> {selectedLog?.toEmail}
                    </Text>
                    <Text>
                        <strong>Tipo:</strong> {selectedLog?.type}
                    </Text>
                    <Text>
                        <strong>Stato:</strong> {selectedLog?.status}
                    </Text>

                    {selectedLog?.errorMessage && (
                        <Text type="danger">
                            <strong>Errore:</strong> {selectedLog.errorMessage}
                        </Text>
                    )}

                    <div>{modalBody}</div>
                </Space>
            </Modal>
        </div>
    );
}
