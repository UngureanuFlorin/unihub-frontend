import React from "react";
import { Button, Card, Grid, message, Tabs } from "antd";
import { useNavigate } from "react-router-dom";
import { EventsTab, CommentsTab } from "../components/profile/ProfileTabs.jsx";
import ProfileHeader from "../components/profile/ProfileHeader.jsx";
import useAuth from "../hooks/useAuth.js";

const { useBreakpoint } = Grid;

export default function Profile() {
    const screens = useBreakpoint();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [messageApi, contextHolder] = message.useMessage();

    // Dati utente mock
    const p = {
        id: 1,
        name: "Alex Rossi",
        username: "alex.rossi",
        role: "organizer",
        university: "Università degli Studi di Milano",
        faculty: "Informatica",
        bio: "Appassionato di community tech.",
        stats: { events: 12, comments: 48, rating: 4.6, followers: 203 },
        events: [],
        recentComments: [],
        isSelf: true, // ✅ profilo personale
    };

    const tabs = [
        {
            key: "events",
            label: "Eventi creati",
            children: (
                <EventsTab
                    events={p.events}
                    onOpen={(id) => navigate(`/events/${id}`)}
                />
            ),
        },
        {
            key: "comments",
            label: "Commenti",
            children: <CommentsTab comments={p.recentComments} />,
        },
    ];

    return (
        <div style={{ padding: screens.xs ? 12 : 24 }}>
            {contextHolder}

            {/* Header con logout */}
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
                        messageApi.success("✅ Logout effettuato");
                        navigate("/login");
                    }}
                >
                    Logout
                </Button>
            </div>

            {/* Header profilo utente */}
            <ProfileHeader p={p} />

            {/* Tab contenuti */}
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
