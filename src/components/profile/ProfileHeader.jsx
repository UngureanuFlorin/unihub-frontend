import React from "react";
import { Avatar, Badge, Button, Card, Col, Dropdown, Divider, Row, Space, Statistic, Tag, Typography } from "antd";
import { EditOutlined, MoreOutlined, CrownOutlined, UserOutlined, SafetyOutlined, TeamOutlined, CalendarOutlined, LikeOutlined, MessageOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const ROLE_META = {
    superadmin: { color: "magenta", label: "Super Admin", icon: <CrownOutlined /> },
    admin: { color: "magenta", label: "Amministratore", icon: <CrownOutlined /> },
    headmod: { color: "gold", label: "Capo-Moderatore", icon: <SafetyOutlined /> },
    moderator: { color: "geekblue", label: "Moderatore", icon: <SafetyOutlined /> },
    organizer: { color: "green", label: "Organizzatore", icon: <CalendarOutlined /> },
    student: { color: "default", label: "Studente", icon: <UserOutlined /> },
    registered: { color: "default", label: "Utente Registrato", icon: <UserOutlined /> },
};

function GradientTitle({ children }) {
    return (
        <span style={{ background: "linear-gradient(90deg, #00d2ff, #3a47d5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 800 }}>
      {children}
    </span>
    );
}

export default function ProfileHeader({ p, onToggleFollow }) {
    const roleKey = (p.role || "registered").toLowerCase();
    const roleMeta = ROLE_META[roleKey] || ROLE_META.registered;

    const menu = {
        items: [
            { key: "copy-link", label: "Copia link profilo" },
            { key: "share", label: "Condividi" },
            { type: "divider" },
            ...(p.isSelf ? [{ key: "settings", label: "Impostazioni" }] : []),
        ],
    };

    return (
        <Card variant={"borderless"} style={{ borderRadius: 16, padding: 20 }} extra={<Dropdown menu={menu} trigger={["click"]}><Button type="text" icon={<MoreOutlined />} /></Dropdown>}>
            <Row gutter={[16, 16]} align="middle">
                <Col xs={24} md={4} style={{ display: "flex", justifyContent: "center" }}>
                    <Badge dot offset={[-4, 4]}>
                        <Avatar size={96} src={p.avatar} icon={!p.avatar && <UserOutlined />} />
                    </Badge>
                </Col>

                <Col xs={24} md={14}>
                    <Space direction="vertical" size={2}>
                        <Title level={3} style={{ margin: 0 }}>
                            <GradientTitle>{p.name}</GradientTitle> <Text type="secondary">@{p.username}</Text>
                        </Title>
                        <Space wrap>
                            <Tag color={roleMeta.color} icon={roleMeta.icon}>{roleMeta.label}</Tag>
                            {p.university && <Tag color="geekblue">{p.university}</Tag>}
                            {p.faculty && <Tag color="purple">{p.faculty}</Tag>}
                        </Space>
                        {p.bio && <Paragraph style={{ margin: "6px 0 0" }}>{p.bio}</Paragraph>}
                    </Space>
                </Col>

                <Col xs={24} md={6}>
                    <Row gutter={[8, 8]}>
                        <Col span={12}><Card size="small" variant={"borderless"}><Statistic title="Eventi" value={p.stats.events} prefix={<CalendarOutlined />} /></Card></Col>
                        <Col span={12}><Card size="small" variant={"borderless"}><Statistic title="Commenti" value={p.stats.comments} prefix={<MessageOutlined />} /></Card></Col>
                        <Col span={12}><Card size="small" variant={"borderless"}><Statistic title="Rating" value={p.stats.rating} precision={1} prefix={<LikeOutlined />} /></Card></Col>
                        <Col span={12}><Card size="small" variant={"borderless"}><Statistic title="Followers" value={p.stats.followers} prefix={<TeamOutlined />} /></Card></Col>
                    </Row>
                </Col>
            </Row>

            <Divider style={{ margin: "16px 0" }} />

            <Space wrap>
                {p.isSelf ? (
                    <Button type="primary" icon={<EditOutlined />}>Modifica profilo</Button>
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
