import React from "react";
import {
    Row,
    Col,
    Typography,
    Button,
    Card,
    Space,
    Tag,
    Divider,
    Tooltip,
} from "antd";
import {
    CalendarOutlined,
    PlusCircleOutlined,
    CompassOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

const { Title, Paragraph, Text } = Typography;

function Home() {
    const navigate = useNavigate();

    return (
        <div
            style={{
                minHeight: "100vh",
                padding: "72px 24px",
                background: "linear-gradient(90deg, #e3ffe7 0%, #d9e7ff 100%)",
                position: "relative",
            }}
        >
            {/* 🚀 Emoji profilo con tooltip accattivante */}
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
            🚀 Entra nel tuo spazio!
          </span>
                }
            >
                <div
                    onClick={() => navigate("/profile")}
                    style={{
                        position: "absolute",
                        top: 20,
                        right: 28,
                        fontSize: 36,
                        cursor: "pointer",
                        userSelect: "none",
                        transition: "transform 0.25s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2) rotate(10deg)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1) rotate(0deg)")}
                >
                    🚀
                </div>
            </Tooltip>

            {/* CONTENUTO CENTRALE */}
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
                                maxWidth: 600, // 🔹 limita la larghezza del blocco testo
                                marginLeft: "auto", // 🔹 centrato orizzontalmente
                                marginRight: "auto",
                                lineHeight: 1.6, // 🔹 più aria tra le righe
                                textAlign: "center", // 🔹 allineamento centrale
                            }}
                        >
                            La casa degli <b>eventi universitari</b> e dei{" "}
                            <b>club studenteschi</b>.<br />
                            Scopri cosa succede nel tuo ateneo e proponi le tue iniziative.
                        </Paragraph>


                        <Space size="middle" wrap style={{ justifyContent: "center" }}>
                            <Link to="/events">
                                <Button size="large" icon={<CompassOutlined />}>
                                    Esplora eventi
                                </Button>
                            </Link>
                            <Link to="/create/event">
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<PlusCircleOutlined />}
                                >
                                    Crea evento
                                </Button>
                            </Link>
                        </Space>

                        <Divider style={{ margin: "24px 0" }} />

                        {/* Pillole rapide */}
                        <Space size={[8, 8]} wrap style={{ justifyContent: "center" }}>
                            <Tag color="geekblue">Accademico</Tag>
                            <Tag color="green">Sport</Tag>
                            <Tag color="magenta">Cultura</Tag>
                            <Tag color="gold">Carriera</Tag>
                            <Tag color="purple">Volontariato</Tag>
                        </Space>
                    </Card>

                    {/* 3 highlight minimal */}
                    <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                        <Col xs={24} md={8}>
                            <Card hoverable style={{ borderRadius: 12 }}>
                                <Space direction="vertical" size={6}>
                                    <Text strong>
                                        <CalendarOutlined /> Questa settimana
                                    </Text>
                                    <Text type="secondary">
                                        Hackathon, workshop e sport di ateneo.
                                    </Text>
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
                            <Card hoverable style={{ borderRadius: 12 }}>
                                <Space direction="vertical" size={6}>
                                    <Text strong>Diventa organizzatore</Text>
                                    <Text type="secondary">
                                        Proponi un evento e sali di ruolo.
                                    </Text>
                                </Space>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    );
}

export default Home;
