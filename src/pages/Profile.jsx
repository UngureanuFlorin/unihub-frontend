// src/pages/Profile.jsx
import React, { useMemo } from "react";
import {
    Avatar,
    Badge,
    Button,
    Card,
    Col,
    Descriptions,
    Divider,
    Dropdown,
    Grid,
    List,
    Row,
    Space,
    Statistic,
    Tabs,
    Tag,
    Typography,
    Tooltip,
} from "antd";
import {
    EditOutlined,
    MoreOutlined,
    CrownOutlined,
    UserOutlined,
    SafetyOutlined,
    TeamOutlined,
    CalendarOutlined,
    LikeOutlined,
    MessageOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { useBreakpoint } = Grid;
const { Title, Text, Paragraph } = Typography;

/* ====== Mappa ruolo → stile ====== */
const ROLE_META = {
    admin: { color: "magenta", label: "Amministratore", icon: <CrownOutlined /> },
    headmod: { color: "gold", label: "Capo-Moderatore", icon: <SafetyOutlined /> },
    moderator: { color: "geekblue", label: "Moderatore", icon: <SafetyOutlined /> },
    organizer: { color: "green", label: "Organizzatore", icon: <CalendarOutlined /> },
    registered: { color: "default", label: "Utente Registrato", icon: <UserOutlined /> },
};

/* ====== Hook mock dati profilo (sostituisci con React Query) ====== */
function useProfileData(userId) {
    return useMemo(
        () => ({
            id: userId || "u_123",
            name: "Alex Rossi",
            username: "alex.rossi",
            avatar:
                "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=256&h=256&fit=crop",
            role: "organizer", // admin | headmod | moderator | organizer | registered
            university: "Università degli Studi di Milano",
            faculty: "Informatica",
            bio: "Appassionato di community tech, organizzo hackathon e meetup su AI/Cloud.",
            stats: {
                events: 12,
                comments: 48,
                rating: 4.6,
                followers: 203,
            },
            socials: {
                website: "https://unihub.example.com/@alex",
                github: "https://github.com/alex",
                linkedin: "https://linkedin.com/in/alex",
            },
            events: Array.from({ length: 6 }).map((_, i) => ({
                id: `e_${i + 1}`,
                title: ["Hackathon AI", "Seminario Cloud", "Job Fair", "Workshop React", "Corsa di ateneo", "Concerto Jazz"][i],
                datePretty: ["12 Ott 2025", "20 Ott 2025", "28 Ott 2025", "4 Nov 2025", "10 Nov 2025", "18 Nov 2025"][i],
                category: ["accademico", "accademico", "carriera", "accademico", "sport", "cultura"][i],
                university: "UniMi",
                summary: "Breve descrizione dell'evento con info principali per incuriosire.",
                rating: 4 + (i % 2 ? 0.5 : 0),
                likes: 12 + i,
                comments: 5 + i * 2,
            })),
            recentComments: Array.from({ length: 4 }).map((_, i) => ({
                id: `c_${i + 1}`,
                eventTitle: ["Hackathon AI", "Workshop React", "Job Fair", "Concerto Jazz"][i],
                text: [
                    "Ottimo evento, organizzazione perfetta!",
                    "Slides chiare, relatore top.",
                    "Tanti recruiter presenti, utile.",
                    "Bellissima atmosfera, bravə tuttə!",
                ][i],
                createdAt: ["2gg fa", "4gg fa", "1 sett. fa", "2 sett. fa"][i],
            })),
            isSelf: true, // se è il proprio profilo metti true
            isFollowing: false, // stato iniziale (mock)
        }),
        [userId]
    );
}

/* ====== Titolo con gradient ====== */
function GradientTitle({ children }) {
    return (
        <span
            style={{
                background: "linear-gradient(90deg, #00d2ff 0%, #3a47d5 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 800,
            }}
        >
      {children}
    </span>
    );
}

/* ====== Header profilo con Follow ====== */
function ProfileHeader({ p, onToggleFollow }) {
    const roleMeta = ROLE_META[p.role] || ROLE_META.registered;

    const menu = {
        items: [
            { key: "copy-link", label: "Copia link profilo" },
            { key: "share", label: "Condividi" },
            { type: "divider" },
            ...(p.isSelf ? [{ key: "settings", label: "Impostazioni" }] : []),
        ],
    };

    return (
        <Card
            bordered={false}
            style={{ borderRadius: 16 }}
            bodyStyle={{ padding: 20 }}
            extra={
                <Dropdown menu={menu} trigger={["click"]}>
                    <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
            }
        >
            <Row gutter={[16, 16]} align="middle">
                <Col xs={24} md={4} style={{ display: "flex", justifyContent: "center" }}>
                    <Badge dot offset={[-4, 4]}>
                        <Avatar size={96} src={p.avatar} icon={!p.avatar && <UserOutlined />} />
                    </Badge>
                </Col>

                <Col xs={24} md={14}>
                    <Space direction="vertical" size={2}>
                        <Title level={3} style={{ margin: 0 }}>
                            <GradientTitle>{p.name}</GradientTitle>{" "}
                            <Text type="secondary">@{p.username}</Text>
                        </Title>
                        <Space wrap>
                            <Tag color={roleMeta.color} icon={roleMeta.icon}>
                                {roleMeta.label}
                            </Tag>
                            {p.university && <Tag color="geekblue">{p.university}</Tag>}
                            {p.faculty && <Tag color="purple">{p.faculty}</Tag>}
                        </Space>
                        {p.bio && <Paragraph style={{ margin: "6px 0 0" }}>{p.bio}</Paragraph>}
                    </Space>
                </Col>

                <Col xs={24} md={6}>
                    <Row gutter={[8, 8]}>
                        <Col span={12}>
                            <Card size="small" bordered>
                                <Statistic title="Eventi" value={p.stats.events} prefix={<CalendarOutlined />} />
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card size="small" bordered>
                                <Statistic title="Commenti" value={p.stats.comments} prefix={<MessageOutlined />} />
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card size="small" bordered>
                                <Statistic title="Rating" value={p.stats.rating} precision={1} prefix={<LikeOutlined />} />
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card size="small" bordered>
                                <Statistic
                                    title="Followers"
                                    value={p.stats.followers + (p.isFollowing ? 1 : 0)}
                                    prefix={<TeamOutlined />}
                                />
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>

            <Divider style={{ margin: "16px 0" }} />

            <Space wrap>
                {p.isSelf ? (
                    <Button type="primary" icon={<EditOutlined />}>
                        Modifica profilo
                    </Button>
                ) : (
                    <>
                        <Button type={p.isFollowing ? "default" : "primary"} onClick={onToggleFollow}>
                            {p.isFollowing ? "Following" : "Segui"}
                        </Button>
                        <Button>Messaggia</Button>
                    </>
                )}
            </Space>
        </Card>
    );
}

/* ====== Tab Eventi ====== */
function EventsTab({ events, onOpen }) {
    return (
        <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 3 }}
            dataSource={events}
            renderItem={(ev) => (
                <List.Item key={ev.id}>
                    <Card
                        hoverable
                        title={
                            <Space>
                                <CalendarOutlined />
                                <Text strong>{ev.title}</Text>
                            </Space>
                        }
                        extra={<Text type="secondary">{ev.datePretty}</Text>}
                        onClick={() => onOpen?.(ev.id)}
                        style={{ borderRadius: 12 }}
                    >
                        <Paragraph style={{ minHeight: 48, marginBottom: 8 }}>
                            {ev.summary}
                        </Paragraph>
                        <Space size="small" wrap>
                            <Tag>{ev.category}</Tag>
                            <Tag color="geekblue">{ev.university}</Tag>
                        </Space>
                        <Divider style={{ margin: "12px 0" }} />
                        <Space size="middle">
                            <Tooltip title="Apprezzamenti">
                                <Space size={4}>
                                    <LikeOutlined />
                                    <Text>{ev.likes}</Text>
                                </Space>
                            </Tooltip>
                            <Tooltip title="Commenti">
                                <Space size={4}>
                                    <MessageOutlined />
                                    <Text>{ev.comments}</Text>
                                </Space>
                            </Tooltip>
                        </Space>
                    </Card>
                </List.Item>
            )}
        />
    );
}

/* ====== Tab Commenti ====== */
function CommentsTab({ comments }) {
    return (
        <List
            itemLayout="vertical"
            dataSource={comments}
            renderItem={(c) => (
                <List.Item key={c.id}>
                    <List.Item.Meta
                        title={
                            <Space>
                                <Text strong>Su:</Text> <Text>{c.eventTitle}</Text>
                                <Text type="secondary">• {c.createdAt}</Text>
                            </Space>
                        }
                        description={<Text>{c.text}</Text>}
                    />
                </List.Item>
            )}
        />
    );
}

/* ====== Tab Info ====== */
function AboutTab({ p }) {
    return (
        <Descriptions
            bordered
            size="small"
            column={{ xs: 1, sm: 1, md: 2 }}
            style={{ background: "rgba(255,255,255,0.6)", borderRadius: 8 }}
            items={[
                { key: "name", label: "Nome completo", children: p.name },
                { key: "username", label: "Username", children: `@${p.username}` },
                { key: "role", label: "Ruolo", children: ROLE_META[p.role]?.label || p.role },
                { key: "university", label: "Ateneo", children: p.university || "-" },
                { key: "faculty", label: "Facoltà", children: p.faculty || "-" },
                {
                    key: "website",
                    label: "Website",
                    children: p.socials?.website ? (
                        <a href={p.socials.website} target="_blank" rel="noreferrer">
                            Visita
                        </a>
                    ) : (
                        "-"
                    ),
                },
                {
                    key: "github",
                    label: "GitHub",
                    children: p.socials?.github ? (
                        <a href={p.socials.github} target="_blank" rel="noreferrer">
                            Apri
                        </a>
                    ) : (
                        "-"
                    ),
                },
                {
                    key: "linkedin",
                    label: "LinkedIn",
                    children: p.socials?.linkedin ? (
                        <a href={p.socials.linkedin} target="_blank" rel="noreferrer">
                            Apri
                        </a>
                    ) : (
                        "-"
                    ),
                },
            ]}
        />
    );
}

/* ====== Pagina principale ====== */
function Profile() {
    const navigate = useNavigate();
    const screens = useBreakpoint();

    const userId = "u_123";

    // ✅ chiama il custom hook al top-level
    const p = useProfileData(userId);

    // ✅ stato locale separato
    const [isFollowing, setIsFollowing] = React.useState(p.isFollowing);
    const onToggleFollow = () => setIsFollowing((v) => !v);

    const tabs = [
        { key: "events", label: "Eventi creati",
            children: <EventsTab events={p.events} onOpen={(id) => navigate(`/events/${id}`)} /> },
        { key: "comments", label: "Commenti", children: <CommentsTab comments={p.recentComments} /> },
        { key: "about", label: "Info", children: <AboutTab p={p} /> },
    ];

    return (
        <div style={{ padding: screens.xs ? 12 : 24 }}>
            <ProfileHeader
                p={{ ...p, isFollowing }}
                onToggleFollow={onToggleFollow}
            />
            <Card bordered={false} style={{ marginTop: 16, borderRadius: 16 }}>
                <Tabs defaultActiveKey="events" items={tabs} tabBarGutter={24} destroyInactiveTabPane />
            </Card>
        </div>
    );
}

export default Profile;
