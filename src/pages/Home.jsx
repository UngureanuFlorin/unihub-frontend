import { Avatar, Badge, Button, Card, Col, Divider, Row, Space, Tag, Tooltip, Typography } from "antd";
import {
    CalendarOutlined,
    CompassOutlined,
    InboxOutlined,
    PlusCircleOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import { useUserProfile } from "../queries/users.queries.js";
import { useUnreadMessages } from "../queries/messages.queries.js";

const { Title, Paragraph, Text } = Typography;

const iconBaseStyle = {
    fontSize: 26,
    color: "#1677ff",
    cursor: "pointer",
    transition: "transform 0.2s ease",
};

const avatarBaseStyle = {
    cursor: "pointer",
    border: "2px solid #1677ff",
    transition: "transform 0.2s ease",
};

const rocketBaseStyle = {
    position: "absolute",
    top: 20,
    right: 28,
    fontSize: 36,
    cursor: "pointer",
    userSelect: "none",
    transition: "transform 0.25s ease",
};

function scaleOn(enterScale, rotate = 0) {
    return {
        onMouseEnter: (e) => {
            e.currentTarget.style.transform = `scale(${enterScale}) rotate(${rotate}deg)`;
        },
        onMouseLeave: (e) => {
            e.currentTarget.style.transform = "scale(1) rotate(0deg)";
        },
    };
}

export default function Home() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const userId = user?.id;

    const { data: unreadCount = 0, isLoading: isUnreadLoading } = useUnreadMessages(userId);
    const { data: profile } = useUserProfile(userId);

    const isSuperAdmin = user?.role === "SUPERADMIN";

    return (
        <div
            style={{
                minHeight: "100vh",
                padding: "72px 24px",
                background: "linear-gradient(90deg, #e3ffe7 0%, #d9e7ff 100%)",
                position: "relative",
            }}
        >
            {!user && (
                <Tooltip
                    placement="bottomRight"
                    color="white"
                    title={
                        <span
                            style={{
                                fontWeight: "bold",
                                background: "linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                fontSize: 14,
                            }}
                        >
                            Entra nel tuo spazio!
                        </span>
                    }
                >
                    <div
                        onClick={() => navigate("/login")}
                        style={rocketBaseStyle}
                        {...scaleOn(1.2, 10)}
                    >
                        🚀
                    </div>
                </Tooltip>
            )}

            {user && (
                <div
                    style={{
                        position: "absolute",
                        top: 16,
                        right: 24,
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                    }}
                >
                    <Tooltip title="Messaggi">
                        <Badge count={isUnreadLoading ? 0 : unreadCount} size="small">
                            <InboxOutlined
                                style={iconBaseStyle}
                                onClick={() => navigate("/messages")}
                                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.15)")}
                                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                            />
                        </Badge>
                    </Tooltip>

                    <Tooltip
                        placement="bottomRight"
                        color="white"
                        title={
                            <span
                                style={{
                                    fontWeight: "bold",
                                    background: "linear-gradient(90deg, #00d2ff 0%, #3a47d5 100%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    fontSize: 14,
                                }}
                            >
                                Ciao {user.username}!
                            </span>
                        }
                    >
                        <Avatar
                            size={48}
                            icon={<UserOutlined />}
                            src={profile?.profileImage || user.image || null}
                            onClick={() => navigate("/profile")}
                            style={avatarBaseStyle}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.15)")}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                        />
                    </Tooltip>
                </div>
            )}

            <Row justify="center" gutter={[24, 24]} style={{ width: "100%" }}>
                <Col xs={24} md={18} lg={14}>
                    <Card
                        variant="borderless"
                        style={{
                            borderRadius: 16,
                            padding: 32,
                            background: "rgba(255,255,255,0.9)",
                            boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                            textAlign: "center",
                        }}
                    >
                        <div style={{ fontSize: 42, lineHeight: 1, marginBottom: 8 }}>👋</div>

                        <Title level={1} style={{ marginBottom: 8 }}>
                            <span
                                style={{
                                    background: "linear-gradient(90deg, #00d2ff 0%, #3a47d5 100%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    fontWeight: 800,
                                }}
                            >
                                UniHub
                            </span>
                        </Title>

                        <Paragraph
                            style={{
                                fontSize: 18,
                                color: "#333",
                                marginBottom: 24,
                                fontWeight: 300,
                                maxWidth: 600,
                                marginLeft: "auto",
                                marginRight: "auto",
                                lineHeight: 1.6,
                                textAlign: "center",
                            }}
                        >
                            La casa degli <b>eventi universitari</b> e dei <b>club studenteschi</b>.
                            <br />
                            Scopri cosa succede nel tuo ateneo e proponi le tue iniziative.
                        </Paragraph>

                        <Space size="middle" wrap style={{ justifyContent: "center" }}>
                            <Link to="/events">
                                <Button size="large" icon={<CompassOutlined />}>
                                    Esplora eventi
                                </Button>
                            </Link>

                            <Link to="/create/event">
                                <Button type="primary" size="large" icon={<PlusCircleOutlined />}>
                                    Crea evento
                                </Button>
                            </Link>
                        </Space>

                        <Divider style={{ margin: "24px 0" }} />

                        <Space size={[8, 8]} wrap style={{ justifyContent: "center" }}>
                            <Tag color="geekblue">Accademico</Tag>
                            <Tag color="green">Sport</Tag>
                            <Tag color="magenta">Cultura</Tag>
                            <Tag color="gold">Carriera</Tag>
                            <Tag color="purple">Volontariato</Tag>
                        </Space>
                    </Card>

                    <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                        <Col xs={24} md={8}>
                            <Card hoverable style={{ borderRadius: 12 }}>
                                <Space direction="vertical" size={6}>
                                    <Text strong>
                                        <CalendarOutlined /> Questa settimana
                                    </Text>
                                    <Text type="secondary">Hackathon, workshop e sport di ateneo.</Text>
                                </Space>
                            </Card>
                        </Col>

                        <Col xs={24} md={8}>
                            <Link to="/clubs">
                                <Card hoverable style={{ borderRadius: 12 }}>
                                    <Space direction="vertical" size={6}>
                                        <Text strong>Club attivi</Text>
                                        <Text type="secondary">
                                            Musica, tech, volontariato e molto altro.
                                        </Text>
                                    </Space>
                                </Card>
                            </Link>
                        </Col>

                        <Col xs={24} md={8}>
                            <Link to="/users">
                                <Card hoverable style={{ borderRadius: 12 }}>
                                    <Space direction="vertical" size={6}>
                                        <Text strong>Segui i tuoi colleghi</Text>
                                        <Text type="secondary">
                                            Segui un collega per vedere gli eventi che pubblica!
                                        </Text>
                                    </Space>
                                </Card>
                            </Link>
                        </Col>

                        {isSuperAdmin && (
                            <Col xs={24} md={8}>
                                <Link to="/universita">
                                    <Card hoverable style={{ borderRadius: 12 }}>
                                        <Space direction="vertical" size={6}>
                                            <Text strong>Modifica</Text>
                                            <Text type="secondary">
                                                Aggiungi ed elimina universita e dipartimenti
                                            </Text>
                                        </Space>
                                    </Card>
                                </Link>
                            </Col>
                        )}
                    </Row>
                </Col>
            </Row>
        </div>
    );
}
