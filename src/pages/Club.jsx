import React from "react";
import { useNavigate } from "react-router-dom";
import { useClubs } from "../queries/clubs.queries";
import { Card, List, Typography, Skeleton, Empty, Alert, Tag, Button, Space } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

export default function Club() {
    const navigate = useNavigate();
    const { data, status, error } = useClubs();

    return (
        <div style={{ padding: 24 }}>
            {/* Bottone back */}
            <Space size="small" style={{ marginBottom: 12 }}>
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/home")}>
                    Torna alla home
                </Button>
            </Space>

            <Title level={2} style={{ marginBottom: 8 }}>
                <span
                    style={{
                        background: "linear-gradient(90deg, #00d2ff 0%, #3a47d5 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        fontWeight: 800,
                    }}
                >
                    Club
                </span>{" "}
                — scopri le community
            </Title>
            <Text type="secondary">
                Sfoglia i club dell’ateneo e apri il dettaglio per informazioni e membri.
            </Text>

            <div style={{ marginTop: 16 }}>
                {status === "pending" && (
                    <Card>
                        <Skeleton active />
                    </Card>
                )}

                {status === "error" && (
                    <Alert
                        type="error"
                        message="Errore nel caricamento dei club"
                        description={String(error)}
                    />
                )}

                {status === "success" && (!data || data.length === 0) && (
                    <Card>
                        <Empty description="Nessun club trovato" />
                    </Card>
                )}

                {status === "success" && data && data.length > 0 && (
                    <List
                        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
                        dataSource={data}
                        renderItem={(c) => (
                            <List.Item key={c.id}>
                                <Card
                                    hoverable
                                    onClick={() => navigate(`/clubs/${c.id}`)}
                                    style={{ borderRadius: 12, height: "100%" }}
                                    bodyStyle={{ display: "flex", flexDirection: "column", gap: 8 }}
                                    title={<Text strong>{c.name}</Text>}
                                    extra={<Tag color="geekblue">Club</Tag>}
                                >
                                    <Paragraph
                                        ellipsis={{ rows: 3 }}
                                        style={{ marginBottom: 0, minHeight: 72 }}
                                    >
                                        {c.description}
                                    </Paragraph>
                                </Card>
                            </List.Item>
                        )}
                    />
                )}
            </div>
        </div>
    );
}
