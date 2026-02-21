import { useMemo } from "react";
import { Card, Empty, List, Space, Tabs, Typography, message } from "antd";
import { CalendarOutlined, ReadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useSavedEvents, useSavedPosts } from "../queries/bookmarks.queries.js";
import { useRemoveEventBookmark, useRemovePostBookmark } from "../queries/bookmarks.mutations.js";
import useAuth from "../hooks/useAuth.js";
import ListEvents from "../components/common/List.jsx";

const { Text, Paragraph } = Typography;

function formatDate(value) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleString("it-IT", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function mapEvent(dto) {
    return {
        id: String(dto.id),
        title: dto.titolo,
        summary: dto.descrizione,
        description: dto.descrizione,
        category: dto.categoria,
        university: dto.universita,
        date: dto.dataInizio,
        datePretty: formatDate(dto.dataInizio),
        place: dto.luogo,
        organizer: dto.creatore?.username,
        likeCount: dto.likeCount ?? 0,
        userLiked: dto.userLiked ?? false,
        isBookmarked: true,
    };
}

export default function Saved() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { data: savedEvents = [], isLoading: loadingEvents } = useSavedEvents();
    const { data: savedPosts = [], isLoading: loadingPosts } = useSavedPosts();
    const removeEvent = useRemoveEventBookmark();
    const removePost = useRemovePostBookmark();
    const [messageApi, contextHolder] = message.useMessage();

    const eventItems = useMemo(() => savedEvents.map(mapEvent), [savedEvents]);

    const eventsTab = (
        <Card>
            {!eventItems.length && !loadingEvents ? (
                <Empty description="Nessun evento salvato" />
            ) : (
                <ListEvents
                    items={eventItems}
                    isLoading={loadingEvents}
                    isError={false}
                    grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 3 }}
                    onItemClick={(id) => navigate(`/events/${id}`)}
                    onToggleBookmark={(ev) => {
                        if (!user?.id) return;
                        removeEvent.mutate(
                            { eventId: ev.id, userId: user.id },
                            { onError: () => messageApi.error("Errore rimozione") }
                        );
                    }}
                />
            )}
        </Card>
    );

    const postsTab = (
        <Card>
            {!savedPosts.length && !loadingPosts ? (
                <Empty description="Nessun post salvato" />
            ) : (
                <List
                    dataSource={savedPosts}
                    loading={loadingPosts}
                    renderItem={(post) => (
                        <List.Item
                            key={post.id}
                            actions={[
                                <a
                                    key="remove"
                                    onClick={() => {
                                        if (!user?.id) return;
                                        removePost.mutate(
                                            { postId: post.id, userId: user.id },
                                            { onError: () => messageApi.error("Errore rimozione") }
                                        );
                                    }}
                                >
                                    Rimuovi
                                </a>,
                            ]}
                        >
                            <List.Item.Meta
                                title={<Text strong>@{post.authorUsername}</Text>}
                                description={<Text type="secondary">{formatDate(post.createdAt)}</Text>}
                            />
                            <Paragraph style={{ margin: 0 }}>{post.content}</Paragraph>
                        </List.Item>
                    )}
                />
            )}
        </Card>
    );

    return (
        <div style={{ padding: 24 }}>
            {contextHolder}
            <Tabs
                defaultActiveKey="events"
                items={[
                    {
                        key: "events",
                        label: (
                            <Space>
                                <CalendarOutlined />
                                Eventi salvati
                            </Space>
                        ),
                        children: eventsTab,
                    },
                    {
                        key: "posts",
                        label: (
                            <Space>
                                <ReadOutlined />
                                Post salvati
                            </Space>
                        ),
                        children: postsTab,
                    },
                ]}
            />
        </div>
    );
}
