import React from "react";
import { Card, Grid, Tabs } from "antd";
import { useNavigate } from "react-router-dom";
import useToggleFollow from "../hooks/useToggleFollow.js";
import { EventsTab, CommentsTab} from "../components/profile/ProfileTabs.jsx";
import ProfileHeader from "../components/profile/ProfileHeader.jsx";

const { useBreakpoint } = Grid;

export default function Profile() {
    const screens = useBreakpoint();
    const navigate = useNavigate();

    // mock dati utente (per ora come prima)
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
        isSelf: false,
    };

    // mock follow
    const { isFollowing, toggleFollow, loading } = useToggleFollow(false);

    const tabs = [
        { key: "events", label: "Eventi creati", children: <EventsTab events={p.events} onOpen={(id) => navigate(`/events/${id}`)} /> },
        { key: "comments", label: "Commenti", children: <CommentsTab comments={p.recentComments} /> }
    ];

    return (
        <div style={{ padding: screens.xs ? 12 : 24 }}>
            <ProfileHeader
                p={{ ...p, isFollowing }}
                onToggleFollow={toggleFollow}
                loading={loading}
            />
            <Card variant={"outlined"} style={{ marginTop: 16, borderRadius: 16 }}>
                <Tabs defaultActiveKey="events" items={tabs} tabBarGutter={24} destroyOnHidden={true} />
            </Card>
        </div>
    );
}
