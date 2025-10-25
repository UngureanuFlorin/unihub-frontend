import React from "react";
import { Card, List, Typography, Space, Empty } from "antd";
import { CalendarOutlined, EnvironmentOutlined, UserOutlined } from "@ant-design/icons";

const { Text, Paragraph } = Typography;

export function EventsTab({ events = [], onOpen }) {
    if (!events.length) {
        return <Empty description="Nessun evento creato" style={{ marginTop: 40 }} />;
    }

    return (
        <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 2 }}
            dataSource={events}
            renderItem={(ev) => (
                <List.Item key={ev.id}>
                    <Card
                        hoverable
                        onClick={() => onOpen(ev.id)}
                        style={{
                            borderRadius: 12,
                            cursor: "pointer",
                            minHeight: 160,
                        }}
                    >
                        <Space direction="vertical" size={4} style={{ width: "100%" }}>
                            <Text strong style={{ fontSize: 16 }}>
                                {ev.titolo}
                            </Text>
                            <Paragraph
                                type="secondary"
                                ellipsis={{ rows: 2 }}
                                style={{ marginBottom: 4 }}
                            >
                                {ev.descrizione}
                            </Paragraph>
                            <Text type="secondary">
                                <EnvironmentOutlined /> {ev.luogo}
                            </Text>
                            <Text type="secondary">
                                <CalendarOutlined />{" "}
                                {new Date(ev.dataInizio).toLocaleString("it-IT", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </Text>
                            {ev.creatore && (
                                <Text type="secondary">
                                    <UserOutlined /> @{ev.creatore.username}
                                </Text>
                            )}
                        </Space>
                    </Card>
                </List.Item>
            )}
        />
    );
}
export function CommentsTab({ comments = [], onEventClick }) {
    if (!comments.length) {
        return <Empty description="Nessun commento disponibile" style={{ marginTop: 40 }} />;
    }

    return (
        <List
            itemLayout="vertical"
            dataSource={comments}
            renderItem={(c) => (
                <List.Item key={c.id}>
                    <Card
                        hoverable
                        style={{ borderRadius: 12 }}
                        onClick={() => c.eventoId && onEventClick?.(c.eventoId)}
                    >
                        <Space direction="vertical" size={4} style={{ width: "100%" }}>
                            {/* 🔹 Intestazione autore */}
                            <Text strong>
                                <UserOutlined /> @{c.autore?.username}
                            </Text>

                            {/* 🔹 Testo del commento */}
                            <Paragraph style={{ marginBottom: 0 }}>{c.testo}</Paragraph>

                            {/* 🔹 Evento collegato */}
                            {c.eventoId && (
                                <Text type="secondary" style={{ fontSize: 13 }}>
                                    💬 Commento all’evento #{c.eventoId}
                                </Text>
                            )}

                            {/* 🔹 Data creazione */}
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                <CalendarOutlined />{" "}
                                {new Date(c.dataCreazione).toLocaleString("it-IT")}
                            </Text>
                        </Space>
                    </Card>
                </List.Item>
            )}
        />
    );
}