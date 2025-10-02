import React from "react";
import { useParams, Link } from "react-router-dom";
import { useEvent } from "../queries/events.queries";
import { Card, Typography, Space, Tag, Skeleton, Alert, Rate, Divider, Button } from "antd";
import { ArrowLeftOutlined, CalendarOutlined, EnvironmentOutlined, UserOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

function EventDetail() {
    const { id } = useParams();
    const { data: ev, status, error } = useEvent(id);

    if (status === "pending") {
        return (
            <div style={{ padding: 24 }}>
                <Skeleton active paragraph={{ rows: 6 }} />
            </div>
        );
    }

    if (status === "error") {
        return (
            <div style={{ padding: 24 }}>
                <Alert type="error" message="Errore nel caricamento dell'evento" description={String(error)} />
                <div style={{ marginTop: 12 }}>
                    <Link to="/events"><Button icon={<ArrowLeftOutlined />}>Torna agli eventi</Button></Link>
                </div>
            </div>
        );
    }

    if (!ev) return null;

    return (
        <div style={{ padding: 24 }}>
            <Space size="small" style={{ marginBottom: 12 }}>
                <Link to="/home">
                    <Button icon={<ArrowLeftOutlined />}>Torna alla lista</Button>
                </Link>
            </Space>

            <Card>
                <Title level={2} style={{ marginBottom: 8 }}>{ev.title}</Title>

                <Space wrap size="middle" style={{ marginBottom: 12 }}>
                    {ev.datePretty || ev.date ? (
                        <Text><CalendarOutlined /> {ev.datePretty || ev.date}</Text>
                    ) : null}
                    {ev.place ? (
                        <Text><EnvironmentOutlined /> {ev.place}</Text>
                    ) : null}
                    {ev.organizer ? (
                        <Text><UserOutlined /> {ev.organizer}</Text>
                    ) : null}
                </Space>

                <Space wrap size="small" style={{ marginBottom: 16 }}>
                    {ev.category && <Tag>{ev.category}</Tag>}
                    {ev.university && <Tag color="geekblue">{ev.university}</Tag>}
                    {ev.faculty && <Tag color="purple">{ev.faculty}</Tag>}
                </Space>

                <Paragraph style={{ fontSize: 16 }}>{ev.description || ev.summary}</Paragraph>

                <Divider />

                <Space align="center" size="large">
                    <div>
                        <Text type="secondary">Voto medio</Text>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <Rate disabled value={ev.average || 0} />
                            <Text strong>{ev.average ? ev.average.toFixed(1) : "—"}</Text>
                        </div>
                    </div>
                    {/* Qui potrai aggiungere Rate interattivo e azioni (vota/commenta) quando colleghi le mutation */}
                </Space>

                {Array.isArray(ev.comments) && (
                    <>
                        <Divider />
                        <Title level={4} style={{ marginBottom: 12 }}>Commenti</Title>
                        {ev.comments.length === 0 ? (
                            <Text type="secondary">Ancora nessun commento.</Text>
                        ) : (
                            ev.comments.map((c) => (
                                <Card key={c.id} size="small" style={{ marginBottom: 8 }}>
                                    <Space direction="vertical" size={0}>
                                        <Text strong>{c.author || "Utente"}</Text>
                                        <Text>{c.text}</Text>
                                    </Space>
                                </Card>
                            ))
                        )}
                    </>
                )}
            </Card>
        </div>
    );
}

export default EventDetail;
