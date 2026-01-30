import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useEvent } from "../queries/events.queries";
import { useIscriviEvento, useDisiscriviEvento } from "../queries/events.mutations";
import { useCommentsByEvento } from "../queries/comments.queries";
import { useCreateComment, useDeleteComment } from "../queries/comments.mutations";
import { useCreateReport } from "../queries/reports.mutations.js";
import {
    Alert,
    Avatar,
    Button,
    Card,
    Divider,
    Form,
    Input,
    List,
    Modal,
    Popconfirm,
    Progress,
    Select,
    Skeleton,
    Space,
    Tag,
    Tooltip,
    Typography,
    message,
} from "antd";
import {
    ArrowLeftOutlined,
    CalendarOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    DeleteOutlined,
    EnvironmentOutlined,
    FlagOutlined,
    HourglassOutlined,
    SendOutlined,
    TeamOutlined,
    UserOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { getErrorMessage } from "../utils/error.js";

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

function escapeIcs(value) {
    return String(value || "")
        .replace(/\\/g, "\\\\")
        .replace(/;/g, "\\;")
        .replace(/,/g, "\\,")
        .replace(/\n/g, "\\n");
}

function toIcsDate(value) {
    if (!value) return "";

    const normalized =
        typeof value === "string" && value.includes(" ") ? `${value.replace(" ", "T")}:00` : value;

    const date = new Date(normalized);
    if (Number.isNaN(date.getTime())) return "";

    const pad = (n) => String(n).padStart(2, "0");

    return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(
        date.getUTCHours()
    )}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;
}

export default function EventDetail() {
    const { id } = useParams();

    const { data: event, status, error, refetch } = useEvent(id);

    const enrollMutation = useIscriviEvento();
    const unenrollMutation = useDisiscriviEvento();

    const { data: comments = [], refetch: refetchComments, isLoading: isCommentsLoading } =
        useCommentsByEvento(id);

    const createCommentMutation = useCreateComment();
    const deleteCommentMutation = useDeleteComment();
    const createReportMutation = useCreateReport();

    const [commentText, setCommentText] = useState("");
    const [messageApi, contextHolder] = message.useMessage();

    const user = JSON.parse(localStorage.getItem("user"));
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportTarget, setReportTarget] = useState(null);
    const [reportForm] = Form.useForm();

    if (status === "pending") return <Skeleton active paragraph={{ rows: 6 }} />;

    if (status === "error") {
        return (
            <Alert
                type="error"
                message="Errore nel caricamento dell'evento"
                description={String(error)}
            />
        );
    }

    if (!event) return null;

    const now = dayjs();
    const deadline = event.deadlinePretty ? dayjs(event.deadlinePretty) : null;

    let subscriptionStatusText = "Non disponibile";
    let subscriptionStatusColor = "default";

    if (deadline && now.isBefore(deadline)) {
        if (event.slotsLeft > 0) {
            subscriptionStatusText = "Iscrizioni aperte";
            subscriptionStatusColor = "green";
        } else {
            subscriptionStatusText = "Posti esauriti";
            subscriptionStatusColor = "orange";
        }
    } else if (deadline && now.isAfter(deadline)) {
        subscriptionStatusText = "Iscrizioni chiuse";
        subscriptionStatusColor = "red";
    }

    const filledPercent = event.slotsTotal
        ? ((event.slotsTotal - event.slotsLeft) / event.slotsTotal) * 100
        : 0;

    const requireAuth = (text) => {
        if (user) return true;
        messageApi.error(text);
        return false;
    };

    const handleAddComment = async () => {
        if (!requireAuth("Devi essere loggato per commentare!")) return;

        if (!commentText.trim()) {
            messageApi.warning("Scrivi qualcosa prima di inviare.");
            return;
        }

        try {
            await createCommentMutation.mutateAsync({
                testo: commentText,
                eventoId: event.id,
                autore: { id: user.id },
            });

            setCommentText("");
            messageApi.success("Commento aggiunto!");
            refetchComments();
        } catch {
            messageApi.error("Errore durante l'invio del commento");
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await deleteCommentMutation.mutateAsync({ commentId, eventoId: event.id });
            messageApi.success("Commento eliminato!");
        } catch {
            messageApi.error("Errore durante l'eliminazione del commento");
        }
    };

    const handleEnroll = async () => {
        if (!requireAuth("Devi essere loggato per iscriverti!")) return;

        try {
            await enrollMutation.mutateAsync({
                eventoId: event.id,
                studenteId: user.id,
            });

            messageApi.success("Ti sei iscritto all'evento!");
            refetch();
        } catch (err) {
            messageApi.error(getErrorMessage(err, "Errore durante l'iscrizione"));
        }
    };

    const handleUnenroll = async () => {
        if (!requireAuth("Devi essere loggato per disiscriverti!")) return;

        try {
            await unenrollMutation.mutateAsync({
                eventoId: event.id,
                studenteId: user.id,
            });

            messageApi.success("Ti sei disiscritto dall'evento");
            refetch();
        } catch (err) {
            messageApi.error(getErrorMessage(err, "Errore durante la disiscrizione"));
        }
    };

    const openReportModal = (targetType, targetId) => {
        if (!requireAuth("Devi essere loggato per segnalare")) return;

        setReportTarget({ targetType, targetId });
        reportForm.resetFields();
        setIsReportModalOpen(true);
    };

    const handleSubmitReport = async () => {
        if (!reportTarget) return;

        try {
            const values = await reportForm.validateFields();

            await createReportMutation.mutateAsync({
                targetType: reportTarget.targetType,
                targetId: reportTarget.targetId,
                reporterId: user.id,
                reason: values.reason,
                details: values.details,
            });

            messageApi.success("Segnalazione inviata");
            setIsReportModalOpen(false);
        } catch (err) {
            if (err?.errorFields) return;
            messageApi.error(getErrorMessage(err, "Errore invio segnalazione"));
        }
    };

    const handleExportCalendar = () => {
        const start = toIcsDate(event.date);
        const endRaw = event.endDate || null;

        const end = endRaw
            ? toIcsDate(endRaw)
            : start
                ? toIcsDate(dayjs(event.date.replace(" ", "T")).add(1, "hour").toDate())
                : "";

        if (!start) {
            messageApi.error("Data evento non valida");
            return;
        }

        const ics = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//UniHub//IT",
            "BEGIN:VEVENT",
            `UID:${event.id}@unihub`,
            `DTSTAMP:${toIcsDate(new Date())}`,
            `DTSTART:${start}`,
            end ? `DTEND:${end}` : null,
            `SUMMARY:${escapeIcs(event.title)}`,
            `DESCRIPTION:${escapeIcs(event.description || event.summary)}`,
            event.place ? `LOCATION:${escapeIcs(event.place)}` : null,
            "END:VEVENT",
            "END:VCALENDAR",
        ]
            .filter(Boolean)
            .join("\r\n");

        const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `evento-${event.id}.ics`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    };

    const canEnroll = subscriptionStatusText === "Iscrizioni aperte";

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
                <Space align="center" style={{ justifyContent: "space-between", width: "100%" }}>
                    <Title level={2} style={{ marginBottom: 8 }}>
                        {event.title}
                    </Title>

                    <Tag color={subscriptionStatusColor} style={{ fontWeight: 600 }}>
                        {subscriptionStatusText}
                    </Tag>
                </Space>

                <Space wrap size="middle" style={{ marginBottom: 16 }}>
                    {event.datePretty && (
                        <Tooltip title="Data inizio evento">
                            <Text>
                                <CalendarOutlined /> {event.datePretty}
                            </Text>
                        </Tooltip>
                    )}

                    {event.endDatePretty && (
                        <Tooltip title="Data fine evento">
                            <Text>
                                <ClockCircleOutlined /> {event.endDatePretty}
                            </Text>
                        </Tooltip>
                    )}

                    {event.place && (
                        <Text>
                            <EnvironmentOutlined /> {event.place}
                        </Text>
                    )}

                    {event.organizer && (
                        <Text>
                            <UserOutlined /> Organizzato da <b>@{event.organizer}</b>
                        </Text>
                    )}

                    <Button icon={<CalendarOutlined />} onClick={handleExportCalendar}>
                        Esporta .ics
                    </Button>

                    <Button icon={<FlagOutlined />} onClick={() => openReportModal("EVENT", event.id)}>
                        Segnala evento
                    </Button>
                </Space>

                <Paragraph style={{ fontSize: 16, marginBottom: 16 }}>
                    {event.description || event.summary}
                </Paragraph>

                {event.deadlinePretty && (
                    <Text type="secondary" style={{ display: "block", marginBottom: 8 }}>
                        <HourglassOutlined /> Iscrizioni entro: <b>{event.deadlinePretty}</b>
                    </Text>
                )}

                {event.slotsTotal && (
                    <>
                        <Divider />
                        <Space align="center" size="large">
                            <Tooltip title={`Posti disponibili: ${event.slotsLeft}/${event.slotsTotal}`}>
                                <div>
                                    <Text strong>
                                        <TeamOutlined /> Posti totali: {event.slotsTotal}
                                    </Text>

                                    <Progress
                                        percent={Math.round(filledPercent)}
                                        showInfo={false}
                                        strokeColor="#3a47d5"
                                        style={{ width: 200, marginLeft: 10 }}
                                    />

                                    <Text type="secondary">{event.slotsLeft} posti rimasti</Text>
                                </div>
                            </Tooltip>
                        </Space>
                    </>
                )}

                {event.attendees?.length > 0 && (
                    <>
                        <Divider />
                        <Title level={4}>Partecipanti</Title>

                        <Space wrap size="small">
                            {event.attendees.map((attendee) => (
                                <Tooltip key={attendee.id} title={`@${attendee.username}`}>
                                    <Avatar
                                        size={32}
                                        src={attendee.profileImage || null}
                                        icon={<UserOutlined />}
                                    />
                                </Tooltip>
                            ))}
                        </Space>
                    </>
                )}

                <Divider />

                <div style={{ textAlign: "center", marginBottom: 16 }}>
                    {event.userIscritto ? (
                        <Button
                            danger
                            size="large"
                            icon={<CloseCircleOutlined />}
                            loading={unenrollMutation.isPending}
                            onClick={handleUnenroll}
                        >
                            Disiscriviti dall'evento
                        </Button>
                    ) : (
                        <Button
                            type="primary"
                            size="large"
                            icon={<CheckCircleOutlined />}
                            disabled={!canEnroll || enrollMutation.isPending}
                            loading={enrollMutation.isPending}
                            onClick={handleEnroll}
                        >
                            Iscriviti all'evento
                        </Button>
                    )}
                </div>

                <Divider />
                <Title level={4}>Commenti</Title>

                <Space.Compact style={{ width: "100%", marginBottom: 12 }}>
                    <TextArea
                        rows={2}
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Scrivi un commento..."
                    />

                    <Button
                        type="primary"
                        icon={<SendOutlined />}
                        onClick={handleAddComment}
                        loading={createCommentMutation.isPending}
                    >
                        Invia
                    </Button>
                </Space.Compact>

                {isCommentsLoading ? (
                    <Skeleton active paragraph={{ rows: 3 }} />
                ) : comments.length === 0 ? (
                    <Text type="secondary">Nessun commento ancora.</Text>
                ) : (
                    <List
                        dataSource={comments}
                        renderItem={(comment) => (
                            <List.Item
                                key={comment.id}
                                actions={
                                    user && user.id === comment.autore?.id
                                        ? [
                                            <Popconfirm
                                                key="delete"
                                                title="Elimina commento?"
                                                okText="Sì"
                                                cancelText="No"
                                                onConfirm={() => handleDeleteComment(comment.id)}
                                            >
                                                <Button
                                                    type="text"
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                />
                                            </Popconfirm>,
                                        ]
                                        : [
                                            <Button
                                                key="report"
                                                type="text"
                                                icon={<FlagOutlined />}
                                                onClick={() => openReportModal("COMMENT", comment.id)}
                                            />,
                                        ]
                                }
                            >
                                <Card
                                    size="small"
                                    style={{ width: "100%", borderRadius: 8 }}
                                    title={
                                        <Space size="small">
                                            <Avatar
                                                size={28}
                                                icon={<UserOutlined />}
                                                src={comment.autore?.profileImage || null}
                                            />
                                            <Text strong>
                                                @{comment.autore?.username || comment.autoreUsername || "utente"}
                                            </Text>
                                        </Space>
                                    }
                                >
                                    {comment.testo}
                                </Card>
                            </List.Item>
                        )}
                    />
                )}
            </Card>

            <Modal
                title="Segnala contenuto"
                open={isReportModalOpen}
                onCancel={() => setIsReportModalOpen(false)}
                okText="Invia"
                confirmLoading={createReportMutation.isPending}
                onOk={handleSubmitReport}
            >
                <Form form={reportForm} layout="vertical">
                    <Form.Item
                        label="Motivo"
                        name="reason"
                        rules={[{ required: true, message: "Seleziona un motivo" }]}
                    >
                        <Select
                            options={[
                                { label: "Spam", value: "Spam" },
                                { label: "Offensivo", value: "Offensivo" },
                                { label: "Fuorviante", value: "Fuorviante" },
                                { label: "Altro", value: "Altro" },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item label="Dettagli" name="details">
                        <Input.TextArea rows={4} placeholder="Descrivi il problema..." />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
