import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useClubs } from "../queries/clubs.queries";
import { Alert, Button, Card, Empty, Input, List, Skeleton, Space, Tag, Typography, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import useAuth from "../hooks/useAuth.js";
import { useCreateClub } from "../queries/clubs.mutations.js";

const { Title, Paragraph, Text } = Typography;

export default function Club() {
    const navigate = useNavigate();
    const { data, status, error } = useClubs();
    const { user } = useAuth();
    const isAdmin = user?.role === "ADMIN";
    const createClubMutation = useCreateClub();
    const [messageApi, contextHolder] = message.useMessage();

    const [newClubName, setNewClubName] = useState("");
    const [newClubDescription, setNewClubDescription] = useState("");
    const [newClubSeats, setNewClubSeats] = useState("");

    return (
        <div style={{ padding: 24 }}>
            {contextHolder}
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
                {isAdmin && (
                    <Card title="Crea un club" style={{ marginBottom: 16 }}>
                        <Space direction="vertical" size="small" style={{ width: "100%" }}>
                            <Input
                                placeholder="Nome club"
                                value={newClubName}
                                onChange={(e) => setNewClubName(e.target.value)}
                            />
                            <Input.TextArea
                                rows={3}
                                placeholder="Descrizione"
                                value={newClubDescription}
                                onChange={(e) => setNewClubDescription(e.target.value)}
                            />
                            <Input
                                placeholder="Posti disponibili"
                                value={newClubSeats}
                                onChange={(e) => setNewClubSeats(e.target.value)}
                            />
                            <Button
                                type="primary"
                                loading={createClubMutation.isPending}
                                onClick={async () => {
                                    try {
                                        const payload = {
                                            nome: newClubName,
                                            descrizione: newClubDescription,
                                            postiDisponibili: Number(newClubSeats) || 0,
                                        };
                                        await createClubMutation.mutateAsync(payload);
                                        setNewClubName("");
                                        setNewClubDescription("");
                                        setNewClubSeats("");
                                        messageApi.success("Club creato");
                                    } catch (err) {
                                        messageApi.error(String(err?.response?.data || "Errore creazione club"));
                                    }
                                }}
                            >
                                Crea club
                            </Button>
                        </Space>
                    </Card>
                )}
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

                {status === "success" && data?.length > 0 && (
                    <List
                        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
                        dataSource={data}
                        renderItem={(club) => (
                            <List.Item key={club.id}>
                                <Card
                                    hoverable
                                    onClick={() => navigate(`/clubs/${club.id}`)}
                                    style={{ borderRadius: 12, height: "100%" }}
                                    bodyStyle={{ display: "flex", flexDirection: "column", gap: 8 }}
                                    title={<Text strong>{club.name}</Text>}
                                    extra={<Tag color="geekblue">Club</Tag>}
                                >
                                    <Paragraph
                                        ellipsis={{ rows: 3 }}
                                        style={{ marginBottom: 0, minHeight: 72 }}
                                    >
                                        {club.description}
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
