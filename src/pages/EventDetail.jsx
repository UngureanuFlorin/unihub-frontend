import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useEvent } from "../queries/events.queries";
import { useIscriviEvento, useDisiscriviEvento } from "../queries/events.mutations";
import { useCommentsByEvento } from "../queries/comments.queries";
import { useCreateComment, useDeleteComment } from "../queries/comments.mutations";
import {
    Card,
    Typography,
    Space,
    Tag,
    Skeleton,
    Alert,
    Divider,
    Button,
    Progress,
    Tooltip,
    message,
    Input,
    List,
    Popconfirm,
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
    SendOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

export default function EventDetail() {
    const { id } = useParams();
    const { data: ev, status, error, refetch } = useEvent(id);
    const iscriviMutation = useIscriviEvento();
    const disiscriviMutation = useDisiscriviEvento();

    // 🗨️ Commenti
    const { data: comments = [], refetch: refetchComments, isLoading: loadingComments } =
        useCommentsByEvento(id);
    const createComment = useCreateComment();
    const deleteComment = useDeleteComment();

    const [newComment, setNewComment] = useState("");
    const [messageApi, contextHolder] = message.useMessage();
    const user = JSON.parse(localStorage.getItem("user"));

    if (status === "pending") return <Skeleton active paragraph={{ rows: 6 }} />;
    if (status === "error")
        return (
            <Alert
                type="error"
                message="Errore nel caricamento dell'evento"
                description={String(error)}
            />
        );
    if (!ev) return null;

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

    // ➕ invio nuovo commento
    const handleAddComment = async () => {
        if (!user) {
            messageApi.error("Devi essere loggato per commentare!");
            return;
        }

        if (!newComment.trim()) {
            messageApi.warning("Scrivi qualcosa prima di inviare.");
            return;
        }

        try {
            await createComment.mutateAsync({
                testo: newComment,
                eventoId: ev.id,
                autore: { id: user.id },
            });
            setNewComment("");
            messageApi.success("Commento aggiunto!");
            refetchComments();
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            messageApi.error("Errore durante l'invio del commento");
        }
    };

    // 🗑️ elimina commento
    const handleDeleteComment = async (commentId) => {
        try {
            await deleteComment.mutateAsync({ commentId, eventoId: ev.id });
            messageApi.success("Commento eliminato!");
        } catch {
            messageApi.error("Errore durante l'eliminazione del commento");
        }
    };

    // ISCRIZIONE / DISISCRIZIONE
    const handleIscrizione = async () => {
        if (!user) {
            messageApi.error("Devi essere loggato per iscriverti!");
            return;
        }

        try {
            await iscriviMutation.mutateAsync({
                eventoId: ev.id,
                studenteId: user.id,
            });
            messageApi.success("Ti sei iscritto all'evento!");
            refetch();
        } catch (err) {
            messageApi.error(err?.response?.data || "Errore durante l'iscrizione");
        }
    };

    const handleDisiscrizione = async () => {
        if (!user) {
            messageApi.error("Devi essere loggato per disiscriverti!");
            return;
        }

        try {
            await disiscriviMutation.mutateAsync({
                eventoId: ev.id,
                studenteId: user.id,
            });
            messageApi.success("Ti sei disiscritto dall'evento");
            refetch();
        } catch (err) {
            messageApi.error(err?.response?.data || "Errore durante la disiscrizione");
        }
    };

    return (
        <div style={{ padding: 24 }}>
            {contextHolder}

            <Link to="/events">
                <Button icon={<ArrowLeftOutlined />}>Torna alla lista</Button>
            </Link>

            <Card
                bordered={false}
                style={{
                    borderRadius: 12,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    background: "rgba(255,255,255,0.95)",
                    marginTop: 12,
                }}
            >
                {/* Titolo e stato */}
                <Space align="center" style={{ justifyContent: "space-between", width: "100%" }}>
                    <Title level={2} style={{ marginBottom: 8 }}>
                        {ev.title}
                    </Title>
                    <Tag color={tagColor} style={{ fontWeight: 600 }}>
                        {stato}
                    </Tag>
                </Space>

                {/* Info evento */}
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

                <Paragraph style={{ fontSize: 16, marginBottom: 16 }}>
                    {ev.description || ev.summary}
                </Paragraph>

                {ev.deadlinePretty && (
                    <Text type="secondary" style={{ display: "block", marginBottom: 8 }}>
                        <HourglassOutlined /> Iscrizioni entro: <b>{ev.deadlinePretty}</b>
                    </Text>
                )}

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

                <Divider />
                <div style={{ textAlign: "center", marginBottom: 16 }}>
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
                            disabled={stato !== "Iscrizioni aperte" || iscriviMutation.isPending}
                            loading={iscriviMutation.isPending}
                            onClick={handleIscrizione}
                        >
                            Iscriviti all'evento
                        </Button>
                    )}
                </div>

                {/* Commenti */}
                <Divider />
                <Title level={4}>Commenti</Title>

                <Space.Compact style={{ width: "100%", marginBottom: 12 }}>
                    <TextArea
                        rows={2}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Scrivi un commento..."
                    />
                    <Button
                        type="primary"
                        icon={<SendOutlined />}
                        onClick={handleAddComment}
                        loading={createComment.isPending}
                    >
                        Invia
                    </Button>
                </Space.Compact>

                {loadingComments ? (
                    <Skeleton active paragraph={{ rows: 3 }} />
                ) : comments.length === 0 ? (
                    <Text type="secondary">Nessun commento ancora.</Text>
                ) : (
                    <List
                        dataSource={comments}
                        renderItem={(c) => (
                            <List.Item
                                key={c.id}
                                actions={
                                    user && user.id === c.autore?.id
                                        ? [
                                            <Popconfirm
                                                title="Elimina commento?"
                                                okText="Sì"
                                                cancelText="No"
                                                onConfirm={() => handleDeleteComment(c.id)}
                                            >
                                                <Button
                                                    type="text"
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                />
                                            </Popconfirm>,
                                        ]
                                        : []
                                }
                            >
                                <Card
                                    size="small"
                                    style={{ width: "100%", borderRadius: 8 }}
                                    title={<Text strong>@{c.autoreUsername || "utente"}</Text>}
                                >
                                    {c.testo}
                                </Card>
                            </List.Item>
                        )}
                    />
                )}
            </Card>
        </div>
    );
}
