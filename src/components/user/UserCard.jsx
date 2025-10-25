import React from "react";
import { Card, Space, Typography, Tag, Button, Skeleton } from "antd";
import { useFollowStatus, useFollowUser, useUnfollowUser } from "../../queries/follow.mutations.js";

const { Text } = Typography;

const ROLE_COLORS = {
    SUPERADMIN: "magenta",
    ADMIN: "red",
    MODERATOR: "geekblue",
    ORGANIZER: "green",
    STUDENT: "blue",
};

export default function UserCard({ u, onOpen }) {
    const userData = JSON.parse(localStorage.getItem("user"));
    const followerId = userData?.id;
    const seguitoId = u.id;

    const { data: isFollowing, isLoading, refetch } = useFollowStatus(followerId, seguitoId);
    const followMutation = useFollowUser();
    const unfollowMutation = useUnfollowUser();

    const handleToggle = async (e) => {
        e.stopPropagation();
        if (!followerId) return;

        try {
            if (isFollowing) {
                await unfollowMutation.mutateAsync({ followerId, seguitoId });
            } else {
                await followMutation.mutateAsync({ followerId, seguitoId });
            }
            refetch();
        } catch {
            // opzionale: messaggio d'errore
        }
    };

    return (
        <Card
            hoverable
            style={{ borderRadius: 12 }}
            onClick={() => onOpen?.(u.id)}
            bodyStyle={{ padding: 16 }}
        >
            <Space direction="vertical" size={6} style={{ width: "100%" }}>
                <Text strong style={{ fontSize: 16 }}>
                    {u.name} {u.surname}
                </Text>
                <Text type="secondary">@{u.username}</Text>

                <Space wrap size="small">
                    {u.role && <Tag color={ROLE_COLORS[u.role] || "default"}>{u.role}</Tag>}
                    {u.faculty && <Tag color="purple">{u.faculty}</Tag>}
                </Space>

                {isLoading ? (
                    <Skeleton.Button active size="small" shape="round" style={{ width: 100 }} />
                ) : (
                    <Space style={{ marginTop: 8 }}>
                        <Button
                            type={isFollowing ? "default" : "primary"}
                            size="small"
                            shape="round"
                            loading={followMutation.isPending || unfollowMutation.isPending}
                            onClick={handleToggle}
                        >
                            {isFollowing ? "Following" : "Segui"}
                        </Button>
                        <Button
                            size="small"
                            shape="round"
                            onClick={(e) => {
                                e.stopPropagation();
                                onOpen?.(u.id);
                            }}
                        >
                            Vedi profilo
                        </Button>
                    </Space>
                )}
            </Space>
        </Card>
    );
}
