import { Link, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Alert, Button, Card, Col, List, Row, Skeleton, Space, Tag, Typography, message } from "antd";
import { ArrowLeftOutlined, CalendarOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import { useUserProfile } from "../queries/users.queries";
import { useFollowUser, useUnfollowUser } from "../queries/follow.mutations";
import { useSendMessage } from "../queries/messages.mutations.js";
import { getErrorMessage } from "../utils/error.js";

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
    const queryClient = useQueryClient();

    const { data: profile, status, error } = useUserProfile(id);

    const followMutation = useFollowUser();
    const unfollowMutation = useUnfollowUser();
    const sendMessageMutation = useSendMessage();

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
                <Alert
                    type="error"
                    message="Errore nel caricamento profilo"
                    description={String(error)}
                />
                <div style={{ marginTop: 12 }}>
                    <Link to="/people">
                        <Button icon={<ArrowLeftOutlined />}>Torna</Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (!profile) return null;

    const currentUser = JSON.parse(localStorage.getItem("user"));
    const isSelf = currentUser?.id === profile.id;

    const toggleFollow = () => {
        if (!currentUser?.id) {
            message.error("Devi essere loggato");
            return;
        }

        const mutation = profile.following ? unfollowMutation : followMutation;

        mutation.mutate(
            { followerId: currentUser.id, seguitoId: profile.id },
            {
                onSuccess: () => {
                    message.success(profile.following ? "Unfollow eseguito" : "Ora segui l’utente");
                    queryClient.invalidateQueries({ queryKey: ["user-profile", id, currentUser.id] });
                },
                onError: (err) => {
                    message.error(getErrorMessage(err, "Errore operazione"));
                },
            }
        );

        if (!profile.following) {
            sendMessageMutation.mutate({
                senderId: currentUser.id,
                receiverId: profile.id,
                content: "Ciao! Ti sto seguendo su UniHub 😊",
            });
        }
    };

    return (
        <div style={{ padding: 24 }}>
            <Space size="small" style={{ marginBottom: 12 }}>
                <Link to="/people">
                    <Button icon={<ArrowLeftOutlined />}>Torna alle persone</Button>
                </Link>
            </Space>

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
                                    {profile.name} {profile.surname}
                                </span>{" "}
                                <Text type="secondary">@{profile.username}</Text>
                            </Title>

                            <Space wrap>
                                {profile.role && (
                                    <Tag color={ROLE_COLORS[profile.role] || "default"}>{profile.role}</Tag>
                                )}
                                {profile.university && <Tag color="geekblue">{profile.university}</Tag>}
                                {profile.faculty && <Tag color="purple">{profile.faculty}</Tag>}
                            </Space>

                            <Space size="large" wrap style={{ marginTop: 8 }}>
                                <Space>
                                    <TeamOutlined />
                                    <Text strong>{profile.followerCount}</Text>
                                    <Text type="secondary">follower</Text>
                                </Space>
                                <Space>
                                    <UserOutlined />
                                    <Text strong>{profile.followingCount}</Text>
                                    <Text type="secondary">seguiti</Text>
                                </Space>
                            </Space>
                        </Space>
                    </Col>

                    <Col xs={24} md={6} style={{ textAlign: "right" }}>
                        {!isSelf && (
                            <Button type={profile.following ? "default" : "primary"} onClick={toggleFollow}>
                                {profile.following ? "Non seguire più" : "Segui"}
                            </Button>
                        )}
                    </Col>
                </Row>
            </Card>

            <Card title="Eventi recenti" bordered={false} style={{ borderRadius: 16 }}>
                {!profile.recentEvents || profile.recentEvents.length === 0 ? (
                    <Text type="secondary">Nessun evento recente.</Text>
                ) : (
                    <List
                        grid={{ gutter: 16, xs: 1, sm: 2, md: 3 }}
                        dataSource={profile.recentEvents}
                        renderItem={(event) => (
                            <List.Item key={event.id}>
                                <Card hoverable style={{ borderRadius: 12 }} bodyStyle={{ padding: 16 }}>
                                    <Space direction="vertical" size={6}>
                                        <Space>
                                            <CalendarOutlined />
                                            <Text strong>{event.titolo}</Text>
                                        </Space>

                                        <Text type="secondary">
                                            {event.dataInizio?.replace("T", " ").slice(0, 16)}
                                        </Text>

                                        {event.luogo && <Tag>{event.luogo}</Tag>}

                                        <Link to={`/events/${event.id}`}>
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
