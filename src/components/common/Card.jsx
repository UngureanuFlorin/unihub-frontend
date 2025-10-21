import React from "react";
import { Card, Typography, Space, Tag } from "antd";
const { Text } = Typography;

export default function CustomCard({ ev, onClick }) {
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
        </Card>
    );
}
