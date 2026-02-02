import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge, Button, Card, Input, List as AntList, Popconfirm, Space, Tabs, message } from "antd";
import { AppstoreOutlined, TagsOutlined } from "@ant-design/icons";
import { useEvents } from "../queries/events.queries";
import { useUniversitaList } from "../queries/universita.queries.js";
import { useCategories } from "../queries/categories.queries.js";
import { useCreateCategory, useDeleteCategory } from "../queries/categories.mutations.js";
import Hero from "../components/common/Hero.jsx";
import Filters from "../components/common/Filters.jsx";
import List from "../components/common/List.jsx";
import useAuth from "../hooks/useAuth.js";

function toLocalDateTimeParam(value) {
    if (!value) return undefined;

    const date = typeof value.toDate === "function" ? value.toDate() : value;
    return date.toISOString().slice(0, 19);
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

    const eventsContent = (
        <>
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
                items={items}
                isLoading={isLoading}
                isError={isError}
                grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 3 }}
                onItemClick={(id) => navigate(`/events/${id}`)}
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

    return (
        <div style={{ padding: 24 }}>
            {contextHolder}
            {isAdmin ? (
                <Tabs
                    defaultActiveKey="events"
                    tabBarStyle={{ marginBottom: 16 }}
                    items={[
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
                        },
                    ]}
                />
            ) : (
                eventsContent
            )}
        </div>
    );
}
