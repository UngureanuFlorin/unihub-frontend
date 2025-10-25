import React from "react";
import { useParams, Link } from "react-router-dom";
import { useEvent } from "../queries/events.queries";
import { useIscriviEvento, useDisiscriviEvento } from "../queries/events.mutations";
import {
    Card,
    Typography,
    Space,
    Tag,
    Skeleton,
    Alert,
    Rate,
    Divider,
    Button,
    Progress,
    Tooltip,
    message,
} from "antd";
import {
    ArrowLeftOutlined,
    CalendarOutlined,
    EnvironmentOutlined,
    UserOutlined,
    ClockCircleOutlined,
    TeamOutlined,
    HourglassOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Paragraph, Text } = Typography;

export default function EventDetail() {
    const { id } = useParams();
    const { data: ev, status, error, refetch } = useEvent(id);
    const iscriviMutation = useIscriviEvento();
    const disiscriviMutation = useDisiscriviEvento();
    const [messageApi, contextHolder] = message.useMessage();

    // Loading e error
    if (status === "pending") {
        return (
            <div style={{ padding: 24 }}>
                <Skeleton active paragraph={{ rows: 6 }} />
            </div>
        );
    }

    if (status === "error") {
        return (
            <div style={{ padding: 24 }}>
                <Alert
                    type="error"
                    message="Errore nel caricamento dell'evento"
                    description={String(error)}
                />
                <div style={{ marginTop: 12 }}>
                    <Link to="/events">
                        <Button icon={<ArrowLeftOutlined />}>Torna agli eventi</Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (!ev) return null;

    // Logica stato iscrizioni
    const now = dayjs();
    const deadline = ev.deadlinePretty ? dayjs(ev.deadlinePretty) : null;

    let stato = "Non disponibile";
    let tagColor = "default";
    if (deadline && now.isBefore(deadline)) {
        if (ev.slotsLeft > 0) {
            stato = "Iscrizioni aperte";
            tagColor = "green";
        } else {
            stato = "Posti esauriti";
            tagColor = "orange";
        }
    } else if (deadline && now.isAfter(deadline)) {
        stato = "Iscrizioni chiuse";
        tagColor = "red";
    }

    const percent = ev.slotsTotal
        ? ((ev.slotsTotal - ev.slotsLeft) / ev.slotsTotal) * 100
        : 0;

    // 🔹 Gestione iscrizione
    const handleIscrizione = async () => {
        const userData = JSON.parse(localStorage.getItem("user"));
        if (!userData) {
            messageApi.error("⚠️ Devi essere loggato per iscriverti!");
            return;
        }

        try {
            await iscriviMutation.mutateAsync({
                eventoId: ev.id,
                studenteId: userData.id,
            });
            messageApi.success("✅ Ti sei iscritto all'evento!");
            refetch(); // 👈 mantiene i dati coerenti (aggiorna posti e stato)
        } catch (err) {
            messageApi.error(err?.response?.data || "Errore durante l'iscrizione");
        }
    };

    const handleDisiscrizione = async () => {
        const userData = JSON.parse(localStorage.getItem("user"));
        if (!userData) {
            messageApi.error("⚠️ Devi essere loggato per disiscriverti!");
            return;
        }

        try {
            await disiscriviMutation.mutateAsync({
                eventoId: ev.id,
                studenteId: userData.id,
            });
            messageApi.success("❌ Ti sei disiscritto dall'evento");
            refetch(); // 👈 aggiorna subito
        } catch (err) {
            messageApi.error(err?.response?.data || "Errore durante la disiscrizione");
        }
    };

    return (
        <div style={{ padding: 24 }}>
            {contextHolder}

            <Space size="small" style={{ marginBottom: 12 }}>
                <Link to="/events">
                    <Button icon={<ArrowLeftOutlined />}>Torna alla lista</Button>
                </Link>
            </Space>

            <Card
                bordered={false}
                style={{
                    borderRadius: 12,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    background: "rgba(255,255,255,0.95)",
                }}
            >
                {/* TITOLI + STATO */}
                <Space
                    align="center"
                    style={{ justifyContent: "space-between", width: "100%" }}
                >
                    <Title level={2} style={{ marginBottom: 8 }}>
                        {ev.title}
                    </Title>
                    <Tag color={tagColor} style={{ fontWeight: 600 }}>
                        {stato}
                    </Tag>
                </Space>

                {/* INFO GENERALI */}
                <Space wrap size="middle" style={{ marginBottom: 16 }}>
                    {ev.datePretty && (
                        <Tooltip title="Data inizio evento">
                            <Text>
                                <CalendarOutlined /> {ev.datePretty}
                            </Text>
                        </Tooltip>
                    )}
                    {ev.endDatePretty && (
                        <Tooltip title="Data fine evento">
                            <Text>
                                <ClockCircleOutlined /> {ev.endDatePretty}
                            </Text>
                        </Tooltip>
                    )}
                    {ev.place && (
                        <Text>
                            <EnvironmentOutlined /> {ev.place}
                        </Text>
                    )}
                    {ev.organizer && (
                        <Text>
                            <UserOutlined /> Organizzato da <b>@{ev.organizer}</b>
                        </Text>
                    )}
                </Space>

                {/* DESCRIZIONE */}
                <Paragraph style={{ fontSize: 16, marginBottom: 16 }}>
                    {ev.description || ev.summary}
                </Paragraph>

                {/* DEADLINE */}
                {ev.deadlinePretty && (
                    <Text type="secondary" style={{ display: "block", marginBottom: 8 }}>
                        <HourglassOutlined /> Iscrizioni entro: <b>{ev.deadlinePretty}</b>
                    </Text>
                )}

                {/* POSTI DISPONIBILI */}
                {ev.slotsTotal && (
                    <>
                        <Divider />
                        <Space align="center" size="large">
                            <Tooltip title={`Posti disponibili: ${ev.slotsLeft}/${ev.slotsTotal}`}>
                                <div>
                                    <Text strong>
                                        <TeamOutlined /> Posti totali: {ev.slotsTotal}
                                    </Text>
                                    <Progress
                                        percent={Math.round(percent)}
                                        showInfo={false}
                                        strokeColor="#3a47d5"
                                        style={{ width: 200, marginLeft: 10 }}
                                    />
                                    <Text type="secondary">
                                        {ev.slotsLeft} posti rimasti
                                    </Text>
                                </div>
                            </Tooltip>
                        </Space>
                    </>
                )}

                {/* BOTTONE ISCRIZIONE/DISISCRIZIONE */}
                <Divider />
                <div style={{ textAlign: "center" }}>
                    {ev.userIscritto ? (
                        <Button
                            danger
                            size="large"
                            icon={<CloseCircleOutlined />}
                            loading={disiscriviMutation.isPending}
                            onClick={handleDisiscrizione}
                        >
                            Disiscriviti dall'evento
                        </Button>
                    ) : (
                        <Button
                            type="primary"
                            size="large"
                            icon={<CheckCircleOutlined />}
                            disabled={
                                stato !== "Iscrizioni aperte" ||
                                iscriviMutation.isPending ||
                                ev.userIscritto
                            }
                            loading={iscriviMutation.isPending}
                            onClick={handleIscrizione}
                        >
                            Iscriviti all'evento
                        </Button>
                    )}
                </div>

                {/* COMMENTI */}
                {Array.isArray(ev.comments) && (
                    <>
                        <Divider />
                        <Title level={4} style={{ marginBottom: 12 }}>
                            Commenti
                        </Title>
                        {ev.comments.length === 0 ? (
                            <Text type="secondary">Ancora nessun commento.</Text>
                        ) : (
                            ev.comments.map((c) => (
                                <Card
                                    key={c.id}
                                    size="small"
                                    style={{ marginBottom: 8, borderRadius: 8 }}
                                >
                                    <Space direction="vertical" size={0}>
                                        <Text strong>{c.author || "Utente"}</Text>
                                        <Text>{c.text}</Text>
                                    </Space>
                                </Card>
                            ))
                        )}
                    </>
                )}
            </Card>
        </div>
    );
}
