import { useMemo, useState } from "react";
import { Badge, Card, Empty, Input, List, Select, Space, Tabs, Typography, message } from "antd";
import { CalendarOutlined, ReadOutlined, SearchOutlined } from "@ant-design/icons";
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

    const [eventSearch, setEventSearch] = useState("");
    const [eventCategory, setEventCategory] = useState(null);
    const [postSearch, setPostSearch] = useState("");

    const eventItems = useMemo(() => savedEvents.map(mapEvent), [savedEvents]);
    const eventCategories = useMemo(
        () =>
            Array.from(new Set(eventItems.map((ev) => ev.category).filter(Boolean))).map((cat) => ({
                value: cat,
                label: cat,
            })),
        [eventItems]
    );
    const filteredEvents = useMemo(() => {
        const query = eventSearch.trim().toLowerCase();
        return eventItems.filter((ev) => {
            const matchesQuery = !query
                || ev.title?.toLowerCase().includes(query)
                || ev.summary?.toLowerCase().includes(query)
                || ev.university?.toLowerCase().includes(query);
            const matchesCategory = !eventCategory || ev.category === eventCategory;
            return matchesQuery && matchesCategory;
        });
    }, [eventItems, eventSearch, eventCategory]);

    const filteredPosts = useMemo(() => {
        const query = postSearch.trim().toLowerCase();
        return savedPosts.filter((post) => {
            if (!query) return true;
            return post.content?.toLowerCase().includes(query)
                || post.authorUsername?.toLowerCase().includes(query);
        });
    }, [savedPosts, postSearch]);

    const eventsTab = (
        <Card>
            <Space wrap style={{ marginBottom: 12 }}>
                <Input
                    allowClear
                    placeholder="Cerca eventi salvati"
                    prefix={<SearchOutlined />}
                    value={eventSearch}
                    onChange={(e) => setEventSearch(e.target.value)}
                    style={{ minWidth: 240 }}
                />
                <Select
                    allowClear
                    placeholder="Categoria"
                    style={{ minWidth: 180 }}
                    options={eventCategories}
                    value={eventCategory}
                    onChange={setEventCategory}
                />
            </Space>
            {!filteredEvents.length && !loadingEvents ? (
                <Empty description="Nessun evento salvato" />
            ) : (
                <ListEvents
                    items={filteredEvents}
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
            <Input
                allowClear
                placeholder="Cerca post salvati"
                prefix={<SearchOutlined />}
                value={postSearch}
                onChange={(e) => setPostSearch(e.target.value)}
                style={{ marginBottom: 12, maxWidth: 280 }}
            />
            {!filteredPosts.length && !loadingPosts ? (
                <Empty description="Nessun post salvato" />
            ) : (
                <List
                    dataSource={filteredPosts}
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
                                <Badge count={eventItems.length} />
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
                                <Badge count={savedPosts.length} />
                            </Space>
                        ),
                        children: postsTab,
                    },
                ]}
            />
        </div>
    );
}
