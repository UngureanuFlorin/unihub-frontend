import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInfiniteEvents } from "../queries/events.queries";
import { useUniversitaList } from "../queries/universita.queries.js";
import Hero from "../components/common/Hero.jsx";
import Filters from "../components/common/Filters.jsx";
import List from "../components/common/List.jsx";

export default function Event() {
    const navigate = useNavigate();

    const [filters, setFilters] = useState({
        search: "",
        category: "",
        university: "",
        dateRange: null,
    });

    const { data: universitaList = [] } = useUniversitaList();

    const params = useMemo(
        () => ({
            search: filters.search,
            category: filters.category,
            university: filters.university,
            startDate: filters.dateRange?.[0]?.toISOString(),
            endDate: filters.dateRange?.[1]?.toISOString(),
        }),
        [filters]
    );
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useInfiniteEvents(params);
    const items = data?.pages?.flatMap((p) => p.items) ?? [];

    return (
        <div style={{ padding: 24 }}>
            <Hero
                titleGradientText="UniHub"

                subtitle="Filtra per ateneo, categoria e data. Clicca un evento per i dettagli."
                onSearch={(q) => setFilters((f) => ({ ...f, search: q }))}
            />

            <Filters
                value={filters}
                onChange={setFilters}
                onQuickTag={(tag) => setFilters((f) => ({ ...f, search: tag }))}
                universities={universitaList}
            />

            <List
                items={items}
                isLoading={isLoading}
                isError={isError}
                grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 3 }}
                onItemClick={(id) => navigate(`/events/${id}`)}
                hasNextPage={!!hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                onLoadMore={fetchNextPage}
            />
        </div>
    );
}
