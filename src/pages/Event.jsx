import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEvents } from "../queries/events.queries";
import Hero from "../components/common/Hero.jsx";
import Filters from "../components/common/Filters.jsx";
import List from "../components/common/List.jsx";

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
        faculty: "",
        dateRange: null,
    });

    const params = useMemo(() => {
        const [start, end] = filters.dateRange ?? [];
        return {
            search: filters.search,
            category: filters.category,
            university: filters.university,
            faculty: filters.faculty,
            from: toLocalDateTimeParam(start),
            to: toLocalDateTimeParam(end),
        };
    }, [filters]);

    const { data: items = [], isLoading, isError } = useEvents(params);

    return (
        <div style={{ padding: 24 }}>
            <Hero
                titleGradientText="UniHub"
                subtitle="Filtra per ateneo, categoria e data. Clicca un evento per i dettagli."
                onSearch={(search) => setFilters((prev) => ({ ...prev, search }))}
            />

            <Filters
                value={filters}
                onChange={setFilters}
                onQuickTag={(tag) => setFilters((prev) => ({ ...prev, search: tag }))}
            />

            <List
                items={items}
                isLoading={isLoading}
                isError={isError}
                grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 3 }}
                onItemClick={(id) => navigate(`/events/${id}`)}
            />
        </div>
    );
}
