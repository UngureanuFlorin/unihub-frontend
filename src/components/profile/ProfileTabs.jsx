import React from "react";
import { Card, Divider, List, Space, Tag, Typography, Tooltip } from "antd";
import { CalendarOutlined, LikeOutlined, MessageOutlined } from "@ant-design/icons";

const { Text, Paragraph } = Typography;

export function EventsTab({ events, onOpen }) {
    return (
        <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 3 }}
            dataSource={events}
            renderItem={(ev) => (
                <List.Item key={ev.id}>
                    <Card
                        hoverable
                        title={<Space><CalendarOutlined /><Text strong>{ev.title}</Text></Space>}
                        extra={<Text type="secondary">{ev.datePretty}</Text>}
                        onClick={() => onOpen?.(ev.id)}
                        style={{ borderRadius: 12 }}
                    >
                        <Paragraph style={{ minHeight: 48, marginBottom: 8 }}>{ev.summary}</Paragraph>
                        <Space size="small" wrap>
                            <Tag>{ev.category}</Tag>
                            {ev.university && <Tag color="geekblue">{ev.university}</Tag>}
                        </Space>
                        <Divider style={{ margin: "12px 0" }} />
                        <Space size="middle">
                            <Tooltip title="Apprezzamenti"><Space size={4}><LikeOutlined /><Text>{ev.likes}</Text></Space></Tooltip>
                            <Tooltip title="Commenti"><Space size={4}><MessageOutlined /><Text>{ev.comments}</Text></Space></Tooltip>
                        </Space>
                    </Card>
                </List.Item>
            )}
        />
    );
}

export function CommentsTab({ comments }) {
    return (
        <List
            itemLayout="vertical"
            dataSource={comments}
            renderItem={(c) => (
                <List.Item key={c.id}>
                    <List.Item.Meta
                        title={<Space><Text strong>Su:</Text><Text>{c.eventTitle}</Text><Text type="secondary">• {c.createdAt}</Text></Space>}
                        description={<Text>{c.text}</Text>}
                    />
                </List.Item>
            )}
        />
    );
}
