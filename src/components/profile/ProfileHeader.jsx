import React from "react";
import { Card, Avatar, Typography, Space, Tag, Button, Tooltip } from "antd";
import { UserOutlined, MailOutlined, TeamOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function ProfileHeader({ p }) {
    if (!p) return null;

    return (
        <Card
            style={{
                borderRadius: 16,
                padding: 24,
                background: "rgba(255,255,255,0.95)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
            }}
        >
            <Space
                direction="vertical"
                style={{
                    width: "100%",
                    textAlign: "center",
                }}
                align="center"
                size="middle"
            >
                {/* Avatar utente */}
                <Avatar
                    size={96}
                    icon={<UserOutlined />}
                    src={p.profileImage || p.image || null}
                    style={{ backgroundColor: "#1677ff" }}
                />

                {/* Nome e username */}
                <div>
                    <Title level={3} style={{ marginBottom: 0 }}>
                        {p.name} {p.surname}
                    </Title>
                    <Text type="secondary">@{p.username}</Text>
                </div>

                {/* Ruolo e università */}
                <Space wrap size="small" style={{ justifyContent: "center" }}>
                    <Tag color="geekblue">{p.role}</Tag>
                    {p.university && <Tag color="purple">{p.university}</Tag>}
                    {p.faculty && <Tag color="magenta">{p.faculty}</Tag>}
                </Space>

                {/* Email */}
                {p.email && (
                    <Space size="small">
                        <MailOutlined />
                        <Text>{p.email}</Text>
                    </Space>
                )}

                {/* Follower / Following */}
                <Space size="large" style={{ marginTop: 12 }}>
                    <Tooltip title="Persone che ti seguono">
                        <span>
                            <TeamOutlined />{" "}
                            <Text strong>{p.followerCount ?? 0}</Text> follower
                        </span>
                    </Tooltip>
                    <Tooltip title="Persone che segui">
                        <span>
                            <UserOutlined />{" "}
                            <Text strong>{p.followingCount ?? 0}</Text> seguiti
                        </span>
                    </Tooltip>
                </Space>
            </Space>
        </Card>
    );
}
