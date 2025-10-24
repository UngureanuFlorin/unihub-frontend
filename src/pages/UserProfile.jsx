// src/pages/UserProfile.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useUserProfile } from "../queries/users.queries";
import { useFollowUser, useUnfollowUser } from "../queries/follow.mutations";
import { useQueryClient } from "@tanstack/react-query";
import {
    Card, Typography, Space, Tag, Button, Row, Col,
    List, Skeleton, Alert, message
} from "antd";
import { ArrowLeftOutlined, UserOutlined, TeamOutlined, CalendarOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const ROLE_COLORS = {
    SUPERADMIN: "magenta",
    ADMIN: "red",
    MODERATOR: "geekblue",
    ORGANIZER: "green",
    STUDENT: "blue",
};

export default function UserProfile() {
    const { id } = useParams();
    const qc = useQueryClient();
    const { data: p, status, error } = useUserProfile(id);
    const followMutation = useFollowUser();
    const unfollowMutation = useUnfollowUser();

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
                <Alert type="error" message="Errore nel caricamento profilo" description={String(error)} />
                <div style={{ marginTop: 12 }}>
                    <Link to="/people"><Button icon={<ArrowLeftOutlined />}>Torna</Button></Link>
                </div>
            </div>
        );
    }

    const me = JSON.parse(localStorage.getItem("user"));
    const isSelf = me?.id === p.id;

    const onToggleFollow = () => {
        if (!me?.id) {
            message.error("Devi essere loggato");
            return;
        }
        const action = p.following ? unfollowMutation : followMutation;
        action.mutate(
            { followerId: me.id, seguitoId: p.id },
            {
                onSuccess: () => {
                    message.success(p.following ? "Unfollow eseguito" : "Ora segui l’utente");
                    qc.invalidateQueries({ queryKey: ["user-profile", id, me.id] });
                },
                onError: (err) => message.error(String(err?.response?.data || "Errore operazione")),
            }
        );
    };

    return (
        <div style={{ padding: 24 }}>
            <Space size="small" style={{ marginBottom: 12 }}>
                <Link to="/people">
                    <Button icon={<ArrowLeftOutlined />}>Torna alle persone</Button>
                </Link>
            </Space>

            {/* Header profilo */}
            <Card
                bordered={false}
                style={{ borderRadius: 16, marginBottom: 16 }}
                bodyStyle={{ padding: 20 }}
            >
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} md={18}>
                        <Space direction="vertical" size={2}>
                            <Title level={3} style={{ margin: 0 }}>
                <span
                    style={{
                        background: "linear-gradient(90deg, #00d2ff 0%, #3a47d5 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        fontWeight: 800,
                    }}
                >
                  {p.name} {p.surname}
                </span>{" "}
                                <Text type="secondary">@{p.username}</Text>
                            </Title>

                            <Space wrap>
                                {p.role && <Tag color={ROLE_COLORS[p.role] || "default"}>{p.role}</Tag>}
                                {p.university && <Tag color="geekblue">{p.university}</Tag>}
                                {p.faculty && <Tag color="purple">{p.faculty}</Tag>}
                            </Space>

                            <Space size="large" wrap style={{ marginTop: 8 }}>
                                <Space>
                                    <TeamOutlined />
                                    <Text strong>{p.followerCount}</Text>
                                    <Text type="secondary">follower</Text>
                                </Space>
                                <Space>
                                    <UserOutlined />
                                    <Text strong>{p.followingCount}</Text>
                                    <Text type="secondary">seguiti</Text>
                                </Space>
                            </Space>
                        </Space>
                    </Col>

                    <Col xs={24} md={6} style={{ textAlign: "right" }}>
                        {!isSelf && (
                            <Button
                                type={p.following ? "default" : "primary"}
                                onClick={onToggleFollow}
                            >
                                {p.following ? "Following" : "Segui"}
                            </Button>
                        )}
                    </Col>
                </Row>
            </Card>

            {/* Eventi creati (recenti) */}
            <Card title="Eventi recenti" bordered={false} style={{ borderRadius: 16 }}>
                {(!p.recentEvents || p.recentEvents.length === 0) ? (
                    <Text type="secondary">Nessun evento recente.</Text>
                ) : (
                    <List
                        grid={{ gutter: 16, xs: 1, sm: 2, md: 3 }}
                        dataSource={p.recentEvents}
                        renderItem={(ev) => (
                            <List.Item key={ev.id}>
                                <Card hoverable style={{ borderRadius: 12 }} bodyStyle={{ padding: 16 }}>
                                    <Space direction="vertical" size={6}>
                                        <Space>
                                            <CalendarOutlined />
                                            <Text strong>{ev.titolo}</Text>
                                        </Space>
                                        <Text type="secondary">
                                            {ev.dataInizio?.replace("T", " ").slice(0, 16)}
                                        </Text>
                                        {ev.luogo && <Tag>{ev.luogo}</Tag>}
                                        <Link to={`/events/${ev.id}`}>
                                            <Button size="small" type="link" style={{ padding: 0 }}>
                                                Vai all’evento
                                            </Button>
                                        </Link>
                                    </Space>
                                </Card>
                            </List.Item>
                        )}
                    />
                )}
            </Card>
        </div>
    );
}
