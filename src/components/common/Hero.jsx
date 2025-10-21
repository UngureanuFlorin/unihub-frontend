import React from "react";
import { Row, Col, Typography, Input } from "antd";

const { Title, Text } = Typography;

export default function Hero({
                                 titleGradientText = "UniHub",
                                 titleSuffix = "scopri gli eventi",
                                 subtitle,
                                 onSearch,
                             }) {
    return (
        <Row gutter={[24, 24]} align="middle">
            <Col xs={24} md={14}>
                <Title level={2} style={{ marginBottom: 8 }}>
          <span
              style={{
                  background: "linear-gradient(90deg, #00d2ff 0%, #3a47d5 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: 700,
              }}
          >
            {titleGradientText}
          </span>{" "}
                    — {titleSuffix}
                </Title>
                {subtitle && <Text type="secondary">{subtitle}</Text>}
            </Col>
            <Col xs={24} md={10}>
                <Input.Search
                    placeholder="Cerca per titolo, parola chiave…"
                    allowClear
                    enterButton="Cerca"
                    onSearch={onSearch}
                />
            </Col>
        </Row>
    );
}
