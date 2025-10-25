import React from "react";
import { Button, Card, Grid, message, Tabs, Spin, Alert } from "antd";
import { useNavigate } from "react-router-dom";
import { EventsTab, CommentsTab } from "../components/profile/ProfileTabs.jsx";
import ProfileHeader from "../components/profile/ProfileHeader.jsx";
import useAuth from "../hooks/useAuth.js";
import { useUserProfile } from "../queries/users.queries.js";
import { useCommentsByAuthor } from "../queries/comments.queries.js";

const { useBreakpoint } = Grid;

export default function Profile() {
    const screens = useBreakpoint();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [messageApi, contextHolder] = message.useMessage();

    // ✅ Dati utente e commenti
    const { data: p, status, error } = useUserProfile(user?.id);
    const { data: commentsData, isLoading: loadingComments } = useCommentsByAuthor(user?.id);

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
        </div>
    );
}
