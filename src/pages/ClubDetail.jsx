import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useClub } from "../queries/clubs.queries";
import { useJoinClub, useLeaveClub } from "../queries/clubs.queries.js";
import { useCreateReport } from "../queries/reports.mutations.js";
import {
    Alert,
    Button,
    Card,
    Divider,
    Form,
    Input,
    List,
    Modal,
    Select,
    Skeleton,
    Space,
    Tag,
    Typography,
    message,
} from "antd";
import {
    ArrowLeftOutlined,
    CheckOutlined,
    CloseOutlined,
    FieldTimeOutlined,
    FlagOutlined,
    TeamOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { getErrorMessage } from "../utils/error.js";

const { Title, Paragraph, Text } = Typography;

export default function ClubDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: club, status, error, refetch } = useClub(id);

    const joinClubMutation = useJoinClub();
    const leaveClubMutation = useLeaveClub();
    const createReportMutation = useCreateReport();

    const [messageApi, contextHolder] = message.useMessage();
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportForm] = Form.useForm();

    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;

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
                    message="Errore nel caricamento del club"
                    description={String(error)}
                />
                <div style={{ marginTop: 12 }}>
                    <Link to="/clubs">
                        <Button icon={<ArrowLeftOutlined />}>Torna ai club</Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (!club) return null;

    const isMember = club.members?.some((member) => String(member.id) === String(userId));

    const requireAuth = () => {
        if (userId) return true;
        messageApi.error("Devi essere loggato per segnalare");
        return false;
    };

    const handleJoin = async () => {
        try {
            await joinClubMutation.mutateAsync({ clubId: club.id, userId });
            messageApi.success("Ti sei unito al club!");
            refetch();
        } catch (err) {
            messageApi.error(getErrorMessage(err, "Errore durante l’iscrizione"));
        }
    };

    const handleLeave = async () => {
        try {
            await leaveClubMutation.mutateAsync({ clubId: club.id, userId });
            messageApi.success("Hai lasciato il club");
            refetch();
        } catch (err) {
            messageApi.error(getErrorMessage(err, "Errore durante la disiscrizione"));
        }
    };

    const openReportModal = () => {
        if (!requireAuth()) return;
        reportForm.resetFields();
        setIsReportModalOpen(true);
    };

    const handleSubmitReport = async () => {
        try {
            const values = await reportForm.validateFields();

            await createReportMutation.mutateAsync({
                targetType: "CLUB",
                targetId: club.id,
                reporterId: userId,
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

    return (
        <div style={{ padding: 24 }}>
            {contextHolder}

            <Space size="small" style={{ marginBottom: 12 }}>
                <Link to="/clubs">
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
                <Space align="center" style={{ justifyContent: "space-between", width: "100%" }}>
                    <Title level={2} style={{ marginBottom: 8 }}>
                        {club.name}
                    </Title>

                    <Space>
                        <Tag color="geekblue">Club</Tag>
                        <Button icon={<FlagOutlined />} onClick={openReportModal}>
                            Segnala club
                        </Button>
                    </Space>
                </Space>

                <Space wrap size="middle" style={{ marginBottom: 12 }}>
                    <Text>
                        <UserOutlined /> Fondatore: <b>@{club.founder}</b>
                    </Text>

                    <Text>
                        <TeamOutlined /> Posti disponibili: <b>{club.seatsLeft}</b>
                    </Text>

                    {club.createdAtPretty && (
                        <Text>
                            <FieldTimeOutlined /> Creato il: <b>{club.createdAtPretty}</b>
                        </Text>
                    )}
                </Space>

                <Paragraph style={{ fontSize: 16 }}>{club.description}</Paragraph>

                <Divider />

                <Title level={4} style={{ marginBottom: 12 }}>
                    Membri
                </Title>

                {club.members.length === 0 ? (
                    <Text type="secondary">Ancora nessun membro iscritto.</Text>
                ) : (
                    <List
                        dataSource={club.members}
                        renderItem={(member) => (
                            <List.Item
                                key={member.id}
                                onClick={() => navigate(`/users/${member.id}`)}
                                style={{ cursor: "pointer" }}
                            >
                                <Space>
                                    <UserOutlined />
                                    <Text>@{member.username}</Text>
                                </Space>
                            </List.Item>
                        )}
                    />
                )}

                <Divider />

                <div style={{ textAlign: "center" }}>
                    {isMember ? (
                        <Button
                            danger
                            icon={<CloseOutlined />}
                            loading={leaveClubMutation.isPending}
                            onClick={handleLeave}
                        >
                            Lascia il club
                        </Button>
                    ) : (
                        <Button
                            type="primary"
                            icon={<CheckOutlined />}
                            loading={joinClubMutation.isPending}
                            onClick={handleJoin}
                        >
                            Unisciti al club
                        </Button>
                    )}
                </div>
            </Card>

            <Modal
                title="Segnala club"
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
