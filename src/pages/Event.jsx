import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge, Button, Card, Input, List as AntList, Popconfirm, Select, Space, Tabs, Typography, message } from "antd";
import { AppstoreOutlined, PlusCircleOutlined, TagsOutlined } from "@ant-design/icons";
import { useEvents } from "../queries/events.queries";
import { useLikeEvent, useUnlikeEvent } from "../queries/events.mutations.js";
import { useUniversitaList } from "../queries/universita.queries.js";
import { useCategories } from "../queries/categories.queries.js";
import { useCreateCategory, useDeleteCategory } from "../queries/categories.mutations.js";
import { useSavedEvents } from "../queries/bookmarks.queries.js";
import { useRemoveEventBookmark, useSaveEventBookmark } from "../queries/bookmarks.mutations.js";
import Hero from "../components/common/Hero.jsx";
import Filters from "../components/common/Filters.jsx";
import List from "../components/common/List.jsx";
import useAuth from "../hooks/useAuth.js";

function toLocalDateTimeParam(value) {
    if (!value) return undefined;

    const date = typeof value.toDate === "function" ? value.toDate() : value;
    return date.toISOString().slice(0, 19);
}

function formatPretty(iso) {
    if (!iso) return undefined;
    return new Date(iso).toLocaleString("it-IT", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function Event() {
    const navigate = useNavigate();

    const [filters, setFilters] = useState({
        search: "",
        category: "",
        university: "",
        dateRange: null,
    });

    const params = useMemo(() => {
        const [start, end] = filters.dateRange ?? [];
        return {
            search: filters.search,
            category: filters.category,
            university: filters.university,
            from: toLocalDateTimeParam(start),
            to: toLocalDateTimeParam(end),
        };
    }, [filters]);

    const { data: items = [], isLoading, isError } = useEvents(params);
    const { data: universities = [] } = useUniversitaList();
    const { data: categories = [] } = useCategories();
    const createCategoryMutation = useCreateCategory();
    const deleteCategoryMutation = useDeleteCategory();
    const { user } = useAuth();
    const isAdmin = user?.role === "ADMIN";
    const [newCategory, setNewCategory] = useState("");
    const [messageApi, contextHolder] = message.useMessage();
    const [likingIds, setLikingIds] = useState([]);
    const likeMutation = useLikeEvent();
    const unlikeMutation = useUnlikeEvent();
    const { data: savedEvents = [] } = useSavedEvents();
    const saveBookmark = useSaveEventBookmark();
    const removeBookmark = useRemoveEventBookmark();

    const savedIds = useMemo(
        () => new Set(savedEvents.map((ev) => String(ev.id))),
        [savedEvents]
    );

    const [savedSearch, setSavedSearch] = useState("");
    const [savedCategory, setSavedCategory] = useState(null);

    const savedItems = useMemo(
        () =>
            savedEvents.map((dto) => ({
                id: String(dto.id),
                title: dto.titolo,
                summary: dto.descrizione,
                description: dto.descrizione,
                category: dto.categoria,
                university: dto.universita,
                date: dto.dataInizio,
                datePretty: formatPretty(dto.dataInizio),
                place: dto.luogo,
                organizer: dto.creatore?.username,
                likeCount: dto.likeCount ?? 0,
                userLiked: dto.userLiked ?? false,
                isBookmarked: true,
            })),
        [savedEvents]
    );

    const savedCategories = useMemo(
        () =>
            Array.from(new Set(savedItems.map((ev) => ev.category).filter(Boolean))).map((cat) => ({
                value: cat,
                label: cat,
            })),
        [savedItems]
    );

    const filteredSavedItems = useMemo(() => {
        const query = savedSearch.trim().toLowerCase();
        return savedItems.filter((ev) => {
            const matchesQuery = !query
                || ev.title?.toLowerCase().includes(query)
                || ev.summary?.toLowerCase().includes(query)
                || ev.university?.toLowerCase().includes(query);
            const matchesCategory = !savedCategory || ev.category === savedCategory;
            return matchesQuery && matchesCategory;
        });
    }, [savedItems, savedSearch, savedCategory]);

    const eventsContent = (
        <>
            <Space
                align="center"
                style={{ width: "100%", justifyContent: "space-between", marginBottom: 16 }}
            >
                <Typography.Title level={3} style={{ margin: 0 }}>
                    Eventi
                </Typography.Title>
                <Button
                    type="primary"
                    icon={<PlusCircleOutlined />}
                    onClick={() => navigate("/create/event")}
                >
                    Crea evento
                </Button>
            </Space>
            <Hero
                titleGradientText="UniHub"
                subtitle="Filtra per ateneo, categoria e data. Clicca un evento per i dettagli."
                onSearch={(search) => setFilters((prev) => ({ ...prev, search }))}
            />

            <Filters
                value={filters}
                onChange={setFilters}
                onQuickTag={(tag) => setFilters((prev) => ({ ...prev, search: tag }))}
                universities={universities}
                categories={categories}
            />

            <List
                items={items.map((ev) => ({
                    ...ev,
                    isBookmarked: savedIds.has(String(ev.id)),
                }))}
                isLoading={isLoading}
                isError={isError}
                grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 3 }}
                onItemClick={(id) => navigate(`/events/${id}`)}
                onToggleLike={(ev) => {
                    if (!user?.id) {
                        messageApi.error("Devi essere loggato");
                        return;
                    }
                    setLikingIds((prev) => [...prev, ev.id]);
                    const mutate = ev.userLiked ? unlikeMutation : likeMutation;
                    mutate.mutate(
                        { eventoId: ev.id, userId: user.id },
                        {
                            onError: () => {
                                messageApi.error("Errore aggiornamento like");
                            },
                            onSettled: () => {
                                setLikingIds((prev) => prev.filter((id) => id !== ev.id));
                            },
                        }
                    );
                }}
                likingIds={likingIds}
                onToggleBookmark={(ev) => {
                    if (!user?.id) {
                        messageApi.error("Devi essere loggato");
                        return;
                    }
                    const mutation = ev.isBookmarked ? removeBookmark : saveBookmark;
                    mutation.mutate(
                        { eventId: ev.id, userId: user.id },
                        { onError: () => messageApi.error("Errore aggiornamento salvataggio") }
                    );
                }}
            />
        </>
    );

    const categoriesContent = (
        <Card title="Categorie evento">
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                <Space style={{ width: "100%" }}>
                    <Input
                        placeholder="Nuova categoria (es. sport)"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                    />
                    <Button
                        type="primary"
                        loading={createCategoryMutation.isPending}
                        onClick={async () => {
                            try {
                                await createCategoryMutation.mutateAsync(newCategory);
                                setNewCategory("");
                                messageApi.success("Categoria aggiunta");
                            } catch (err) {
                                messageApi.error(String(err?.response?.data || "Errore aggiunta categoria"));
                            }
                        }}
                    >
                        Aggiungi
                    </Button>
                </Space>
                <AntList
                    bordered
                    dataSource={categories}
                    locale={{ emptyText: "Nessuna categoria" }}
                    renderItem={(item) => (
                        <AntList.Item
                            actions={[
                                <Popconfirm
                                    key="delete"
                                    title="Eliminare questa categoria?"
                                    okText="Si"
                                    cancelText="No"
                                    onConfirm={async () => {
                                        try {
                                            await deleteCategoryMutation.mutateAsync(item.id);
                                            messageApi.success("Categoria eliminata");
                                        } catch (err) {
                                            messageApi.error(String(err?.response?.data || "Errore eliminazione"));
                                        }
                                    }}
                                >
                                    <Button size="small" danger loading={deleteCategoryMutation.isPending}>
                                        Elimina
                                    </Button>
                                </Popconfirm>,
                            ]}
                        >
                            {item.nome}
                        </AntList.Item>
                    )}
                />
            </Space>
        </Card>
    );

    const savedContent = (
        <Card title="Eventi salvati">
            <Space wrap style={{ marginBottom: 12 }}>
                <Input
                    allowClear
                    placeholder="Cerca eventi salvati"
                    value={savedSearch}
                    onChange={(e) => setSavedSearch(e.target.value)}
                    style={{ minWidth: 240 }}
                />
                <Select
                    allowClear
                    placeholder="Categoria"
                    style={{ minWidth: 180 }}
                    options={savedCategories}
                    value={savedCategory}
                    onChange={setSavedCategory}
                />
            </Space>
            <List
                items={filteredSavedItems}
                isLoading={false}
                isError={false}
                grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 3 }}
                onItemClick={(id) => navigate(`/events/${id}`)}
                onToggleLike={(ev) => {
                    if (!user?.id) {
                        messageApi.error("Devi essere loggato");
                        return;
                    }
                    const mutate = ev.userLiked ? unlikeMutation : likeMutation;
                    mutate.mutate(
                        { eventoId: ev.id, userId: user.id },
                        { onError: () => messageApi.error("Errore aggiornamento like") }
                    );
                }}
                onToggleBookmark={(ev) => {
                    if (!user?.id) {
                        messageApi.error("Devi essere loggato");
                        return;
                    }
                    removeBookmark.mutate(
                        { eventId: ev.id, userId: user.id },
                        { onError: () => messageApi.error("Errore rimozione") }
                    );
                }}
            />
        </Card>
    );

    const tabs = [
        {
            key: "events",
            label: (
                <Space>
                    <AppstoreOutlined />
                    Eventi
                    <Badge
                        count={items.length}
                        overflowCount={999}
                        style={{ backgroundColor: "#1677ff" }}
                    />
                </Space>
            ),
            children: eventsContent,
        },
        {
            key: "saved",
            label: (
                <Space>
                    Eventi salvati
                    <Badge count={savedItems.length} overflowCount={99} />
                </Space>
            ),
            children: savedContent,
        },
    ];

    if (isAdmin) {
        tabs.push({
            key: "categories",
            label: (
                <Space>
                    <TagsOutlined />
                    Categorie
                    <Badge
                        count={categories.length}
                        overflowCount={99}
                        style={{ backgroundColor: "#00b96b" }}
                    />
                </Space>
            ),
            children: categoriesContent,
        });
    }

    return (
        <div style={{ padding: 24 }}>
            {contextHolder}
            <Tabs
                defaultActiveKey="events"
                tabBarStyle={{ marginBottom: 16 }}
                items={tabs}
            />
        </div>
    );
}
