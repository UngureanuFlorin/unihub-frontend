import React, { useMemo, useState } from "react";
import { Button, Card, Modal, Select, Space, Table, Tag, Typography } from "antd";
import dayjs from "dayjs";
import { useEmailHistory } from "../queries/emailLogs.queries.js";

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
    const [status, setStatus] = useState(undefined);
    const [type, setType] = useState(undefined);
    const [selected, setSelected] = useState(null);
    const { data: logs = [], isLoading } = useEmailHistory({ status, type });

    const columns = useMemo(
        () => [
            {
                title: "Data",
                dataIndex: "createdAt",
                width: 170,
                render: (value) => (value ? dayjs(value).format("DD MMM YYYY, HH:mm") : "-")
            },
            {
                title: "Destinatario",
                dataIndex: "toEmail",
                render: (value) => <Text>{value}</Text>,
                width: 220,
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
                dataIndex: "actions",
                width: 120,
                render: (_, record) => (
                    <Button size="small" onClick={() => setSelected(record)}>
                        Vedi
                    </Button>
                ),
            },
        ],
        []
    );

    const modalBody = selected?.html ? (
        <div
            style={{ background: "#fff", padding: 16, borderRadius: 8 }}
            dangerouslySetInnerHTML={{ __html: selected?.body || "" }}
        />
    ) : (
        <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{selected?.body || ""}</pre>
    );

    return (
        <div style={{ padding: 24 }}>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <Card>
                    <Space align="center" style={{ justifyContent: "space-between", width: "100%" }}>
                        <Title level={3} style={{ margin: 0 }}>
                            Email history
                        </Title>
                        <Space>
                            <Select
                                allowClear
                                placeholder="Stato"
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
                open={Boolean(selected)}
                title={selected?.subject}
                onCancel={() => setSelected(null)}
                footer={null}
                width={760}
            >
                <Space direction="vertical" size="small" style={{ width: "100%" }}>
                    <Text>
                        <strong>Da:</strong> {selected?.fromEmail}
                    </Text>
                    <Text>
                        <strong>A:</strong> {selected?.toEmail}
                    </Text>
                    <Text>
                        <strong>Tipo:</strong> {selected?.type}
                    </Text>
                    <Text>
                        <strong>Stato:</strong> {selected?.status}
                    </Text>
                    {selected?.errorMessage && (
                        <Text type="danger">
                            <strong>Errore:</strong> {selected.errorMessage}
                        </Text>
                    )}
                    <div>{modalBody}</div>
                </Space>
            </Modal>
        </div>
    );
}
