import React from "react";
import { Button, Card, Typography, Space, Tag } from "antd";
import { BookFilled, BookOutlined, HeartFilled, HeartOutlined } from "@ant-design/icons";
const { Text } = Typography;

export default function CustomCard({ ev, onClick, onToggleLike, onToggleBookmark, isLiking }) {
    return (
        <Card
            hoverable
            title={ev.title}
            extra={<Text type="secondary">{ev.datePretty || ev.date}</Text>}
            onClick={onClick}
            style={{ width: "100%" }}
        >
            <div style={{ minHeight: 48 }}>{ev.summary || ev.description}</div>
            <Space size={8} style={{ marginTop: 12 }}>
                {ev.category && <Tag>{ev.category}</Tag>}
                {ev.university && <Tag color="geekblue">{ev.university}</Tag>}
                {ev.faculty && <Tag color="purple">{ev.faculty}</Tag>}
            </Space>
            <Space style={{ marginTop: 12 }}>
                <Button
                    size="small"
                    type={ev.userLiked ? "primary" : "default"}
                    icon={ev.userLiked ? <HeartFilled /> : <HeartOutlined />}
                    loading={isLiking}
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleLike?.();
                    }}
                >
                    {ev.likeCount ?? 0}
                </Button>
                <Button
                    size="small"
                    type={ev.isBookmarked ? "primary" : "default"}
                    icon={ev.isBookmarked ? <BookFilled /> : <BookOutlined />}
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark?.();
                    }}
                >
                    Salva
                </Button>
            </Space>
        </Card>
    );
}
