import React, { useEffect, useState } from "react";
import {
    Alert,
    Button,
    Card,
    Form,
    Grid,
    Input,
    message,
    Modal,
    Select,
    Spin,
    Switch,
    Tabs,
    Upload,
} from "antd";
import { useNavigate } from "react-router-dom";
import { EventsTab, CommentsTab } from "../components/profile/ProfileTabs.jsx";
import ProfileHeader from "../components/profile/ProfileHeader.jsx";
import useAuth from "../hooks/useAuth.js";
import { useUserProfile } from "../queries/users.queries.js";
import { useCommentsByAuthor } from "../queries/comments.queries.js";
import { useUpdateUserProfile, useUploadProfileImage } from "../queries/users.mutations.js";
import { useDipartimenti, useUniversitaList } from "../queries/universita.queries.js";
import { UploadOutlined } from "@ant-design/icons";

const { useBreakpoint } = Grid;

export default function Profile() {
    const screens = useBreakpoint();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [messageApi, contextHolder] = message.useMessage();
    const [editOpen, setEditOpen] = useState(false);
    const [selectedUniId, setSelectedUniId] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [form] = Form.useForm();

    // ✅ Dati utente e commenti
    const { data: p, status, error } = useUserProfile(user?.id);
    const { data: commentsData, isLoading: loadingComments } = useCommentsByAuthor(user?.id);
    const updateProfile = useUpdateUserProfile();
    const uploadProfileImage = useUploadProfileImage();
    const { data: universita = [] } = useUniversitaList();
    const { data: dipartimenti = [] } = useDipartimenti(selectedUniId);

    useEffect(() => {
        if (!editOpen || !p) return;
        setSelectedUniId(p.universitaId || null);
        setFileList([]);
        form.setFieldsValue({
            name: p.name,
            surname: p.surname,
            username: p.username,
            email: p.email,
            studentId: p.studentId,
            universitaId: p.universitaId ?? null,
            dipartimentoId: p.dipartimentoId ?? null,
            emailNotificationsEnabled: p.emailNotificationsEnabled ?? true,
        });
    }, [editOpen, form, p]);

    // 🔄 Loading profilo
    if (status === "pending") {
        return (
            <div style={{ textAlign: "center", marginTop: 80 }}>
                <Spin size="large" tip="Caricamento profilo..." />
            </div>
        );
    }

    // ❌ Errore caricamento
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

    if (!p) return null;

    // ✅ Tabs (eventi e commenti)
    const tabs = [
        {
            key: "events",
            label: "Eventi creati",
            children: (
                <EventsTab
                    events={p.recentEvents || []}
                    onOpen={(id) => navigate(`/events/${id}`)}
                />
            ),
        },
        {
            key: "comments",
            label: "Commenti",
            children: loadingComments ? (
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

            {/* HEADER con titolo e logout */}
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
                    <Button onClick={() => setEditOpen(true)}>Modifica profilo</Button>
                    <Button
                        danger
                        type="primary"
                        onClick={() => {
                            logout();
                            messageApi.success("Logout effettuato");
                            navigate("/login");
                        }}
                    >
                        Logout
                    </Button>
                </div>
            </div>

            {/* HEADER PROFILO */}
            <ProfileHeader p={p} />

            {/* TABS */}
            <Card variant="outlined" style={{ marginTop: 16, borderRadius: 16 }}>
                <Tabs
                    defaultActiveKey="events"
                    items={tabs}
                    tabBarGutter={24}
                    destroyInactiveTabPane
                />
            </Card>

            <Modal
                title="Modifica profilo"
                open={editOpen}
                onCancel={() => setEditOpen(false)}
                okText="Salva"
                confirmLoading={updateProfile.isPending}
                onOk={async () => {
                    try {
                        const values = await form.validateFields();
                        const payload = {
                            name: values.name,
                            surname: values.surname,
                            username: values.username,
                            email: values.email,
                            studentId: values.studentId,
                            dipartimentoId: values.dipartimentoId ?? p.dipartimentoId ?? null,
                            emailNotificationsEnabled: values.emailNotificationsEnabled,
                        };
                        const updated = await updateProfile.mutateAsync({
                            userId: p.id,
                            payload,
                        });
                        const selectedFile = fileList[0]?.originFileObj || null;
                        if (selectedFile) {
                            await uploadProfileImage.mutateAsync({
                                userId: p.id,
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
                        setEditOpen(false);
                    } catch (err) {
                        if (err?.errorFields) return;
                        messageApi.error(err?.response?.data || "Errore aggiornamento profilo");
                    }
                }}
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
                            options={(universita || []).map((u) => ({
                                value: u.id,
                                label: u.nome,
                            }))}
                            onChange={(value) => {
                                setSelectedUniId(value);
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
                            disabled={!selectedUniId}
                            options={(dipartimenti || []).map((d) => ({
                                value: d.id,
                                label: d.nome,
                            }))}
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
                            onChange={({ fileList: nextList }) => setFileList(nextList.slice(-1))}
                            onRemove={() => setFileList([])}
                            fileList={fileList}
                        >
                            <Button icon={<UploadOutlined />}>Carica immagine</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
