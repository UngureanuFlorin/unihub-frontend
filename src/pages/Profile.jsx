import { useEffect, useState } from "react";
import {
    Alert,
    Button,
    Card,
    Form,
    Grid,
    Input,
    Modal,
    Select,
    Spin,
    Switch,
    Tabs,
    Upload,
    message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { EventsTab, CommentsTab } from "../components/profile/ProfileTabs.jsx";
import ProfileHeader from "../components/profile/ProfileHeader.jsx";
import useAuth from "../hooks/useAuth.js";
import { useUserProfile } from "../queries/users.queries.js";
import { useCommentsByAuthor } from "../queries/comments.queries.js";
import { useUpdateUserProfile, useUploadProfileImage } from "../queries/users.mutations.js";
import { useDipartimenti, useUniversitaList } from "../queries/universita.queries.js";
import { useReportSupport } from "../queries/support.mutations.js";
import { getErrorMessage } from "../utils/error.js";

const { useBreakpoint } = Grid;

export default function Profile() {
    const screens = useBreakpoint();
    const navigate = useNavigate();

    const { user, logout } = useAuth();
    const userId = user?.id;

    const [messageApi, contextHolder] = message.useMessage();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

    const [selectedUniversityId, setSelectedUniversityId] = useState(null);
    const [profileImageFileList, setProfileImageFileList] = useState([]);

    const [form] = Form.useForm();
    const [supportForm] = Form.useForm();

    const { data: profile, status, error } = useUserProfile(userId);
    const { data: commentsData, isLoading: isCommentsLoading } = useCommentsByAuthor(userId);

    const updateProfileMutation = useUpdateUserProfile();
    const uploadProfileImageMutation = useUploadProfileImage();
    const reportSupportMutation = useReportSupport();

    const { data: universities = [] } = useUniversitaList();
    const { data: departments = [] } = useDipartimenti(selectedUniversityId);

    useEffect(() => {
        if (!isEditModalOpen || !profile) return;

        setSelectedUniversityId(profile.universitaId || null);
        setProfileImageFileList([]);

        form.setFieldsValue({
            name: profile.name,
            surname: profile.surname,
            username: profile.username,
            email: profile.email,
            studentId: profile.studentId,
            universitaId: profile.universitaId ?? null,
            dipartimentoId: profile.dipartimentoId ?? null,
            emailNotificationsEnabled: profile.emailNotificationsEnabled ?? true,
        });
    }, [isEditModalOpen, form, profile]);

    useEffect(() => {
        if (!isSupportModalOpen || !profile) return;

        supportForm.setFieldsValue({
            name: `${profile.name} ${profile.surname}`.trim(),
            email: profile.email || "",
            subject: "Segnalazione UniHub",
        });
    }, [isSupportModalOpen, profile, supportForm]);

    const handleLogout = () => {
        logout();
        messageApi.success("Logout effettuato");
        navigate("/login");
    };

    const handleSaveProfile = async () => {
        if (!profile) return;

        try {
            const values = await form.validateFields();

            const payload = {
                name: values.name,
                surname: values.surname,
                username: values.username,
                email: values.email,
                studentId: values.studentId,
                dipartimentoId: values.dipartimentoId ?? profile.dipartimentoId ?? null,
                emailNotificationsEnabled: values.emailNotificationsEnabled,
            };

            const updated = await updateProfileMutation.mutateAsync({
                userId: profile.id,
                payload,
            });

            const selectedFile = profileImageFileList[0]?.originFileObj || null;
            if (selectedFile) {
                await uploadProfileImageMutation.mutateAsync({
                    userId: profile.id,
                    file: selectedFile,
                });
            }

            localStorage.setItem(
                "user",
                JSON.stringify({
                    id: updated.id,
                    username: updated.username,
                    role: updated.role,
                })
            );

            messageApi.success("Profilo aggiornato");
            setIsEditModalOpen(false);
        } catch (err) {
            if (err?.errorFields) return;
            messageApi.error(getErrorMessage(err, "Errore aggiornamento profilo"));
        }
    };

    const handleSubmitSupport = async () => {
        try {
            const values = await supportForm.validateFields();
            await reportSupportMutation.mutateAsync(values);

            messageApi.success("Segnalazione inviata");
            setIsSupportModalOpen(false);
            supportForm.resetFields();
        } catch (err) {
            if (err?.errorFields) return;
            messageApi.error(getErrorMessage(err, "Errore invio segnalazione"));
        }
    };

    if (status === "pending") {
        return (
            <div style={{ textAlign: "center", marginTop: 80 }}>
                <Spin size="large" tip="Caricamento profilo..." />
            </div>
        );
    }

    if (status === "error") {
        return (
            <div style={{ padding: 24 }}>
                <Alert
                    type="error"
                    message="Errore nel caricamento del profilo"
                    description={String(error)}
                />
                <Button style={{ marginTop: 16 }} onClick={() => navigate("/home")}>
                    Torna alla Home
                </Button>
            </div>
        );
    }

    if (!profile) return null;

    const tabs = [
        {
            key: "events",
            label: "Eventi creati",
            children: (
                <EventsTab events={profile.recentEvents || []} onOpen={(id) => navigate(`/events/${id}`)} />
            ),
        },
        {
            key: "comments",
            label: "Commenti",
            children: isCommentsLoading ? (
                <Spin size="large" tip="Caricamento commenti..." />
            ) : (
                <CommentsTab
                    comments={commentsData || []}
                    onEventClick={(id) => navigate(`/coments/${id}`)}
                />
            ),
        },
    ];

    return (
        <div style={{ padding: screens.xs ? 12 : 24 }}>
            {contextHolder}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                }}
            >
                <h2 style={{ margin: 0 }}>Profilo</h2>

                <div style={{ display: "flex", gap: 12 }}>
                    <Button onClick={() => setIsSupportModalOpen(true)}>Segnala un problema</Button>
                    <Button onClick={() => setIsEditModalOpen(true)}>Modifica profilo</Button>
                    <Button danger type="primary" onClick={handleLogout}>
                        Logout
                    </Button>
                </div>
            </div>

            <ProfileHeader p={profile} />

            <Card variant="outlined" style={{ marginTop: 16, borderRadius: 16 }}>
                <Tabs defaultActiveKey="events" items={tabs} tabBarGutter={24} destroyInactiveTabPane />
            </Card>

            <Modal
                title="Modifica profilo"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                okText="Salva"
                confirmLoading={updateProfileMutation.isPending}
                onOk={handleSaveProfile}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Nome"
                        name="name"
                        rules={[{ required: true, message: "Inserisci il nome" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Cognome"
                        name="surname"
                        rules={[{ required: true, message: "Inserisci il cognome" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: "Inserisci lo username" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "Inserisci la email" },
                            { type: "email", message: "Email non valida" },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Matricola"
                        name="studentId"
                        rules={[{ required: true, message: "Inserisci la matricola" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Universita"
                        name="universitaId"
                        rules={[{ required: true, message: "Seleziona l'universita" }]}
                    >
                        <Select
                            placeholder="Seleziona universita"
                            options={universities.map((u) => ({ value: u.id, label: u.nome }))}
                            onChange={(value) => {
                                setSelectedUniversityId(value);
                                form.setFieldsValue({ dipartimentoId: null });
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Dipartimento"
                        name="dipartimentoId"
                        rules={[{ required: true, message: "Seleziona il dipartimento" }]}
                    >
                        <Select
                            placeholder="Seleziona dipartimento"
                            disabled={!selectedUniversityId}
                            options={departments.map((d) => ({ value: d.id, label: d.nome }))}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Notifiche email"
                        name="emailNotificationsEnabled"
                        valuePropName="checked"
                    >
                        <Switch checkedChildren="On" unCheckedChildren="Off" />
                    </Form.Item>

                    <Form.Item label="Foto profilo">
                        <Upload
                            beforeUpload={() => false}
                            maxCount={1}
                            accept="image/*"
                            fileList={profileImageFileList}
                            onChange={({ fileList: nextList }) =>
                                setProfileImageFileList(nextList.slice(-1))
                            }
                            onRemove={() => setProfileImageFileList([])}
                        >
                            <Button icon={<UploadOutlined />}>Carica immagine</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Segnala un problema"
                open={isSupportModalOpen}
                onCancel={() => setIsSupportModalOpen(false)}
                okText="Invia"
                confirmLoading={reportSupportMutation.isPending}
                onOk={handleSubmitSupport}
            >
                <Form form={supportForm} layout="vertical">
                    <Form.Item
                        label="Nome"
                        name="name"
                        rules={[{ required: true, message: "Inserisci il nome" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "Inserisci la email" },
                            { type: "email", message: "Email non valida" },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="Oggetto" name="subject">
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Messaggio"
                        name="message"
                        rules={[{ required: true, message: "Inserisci il messaggio" }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
