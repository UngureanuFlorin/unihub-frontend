import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
<<<<<<< Updated upstream
import {useEvents} from "../queries/events.queries";
=======
import { useInfiniteEvents } from "../queries/events.queries";
import { useUniversitaList } from "../queries/universita.queries.js";
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
    const toLocalDateTimeParam = (d) => {
        if (!d) return undefined;

        // supporta dayjs/moment (hanno toDate())
        const dateObj = typeof d.toDate === "function" ? d.toDate() : d;

        // manda "YYYY-MM-DDTHH:mm:ss" (senza Z) -> perfetto per LocalDateTime
        return dateObj.toISOString().slice(0, 19);
    };

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
=======
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
>>>>>>> Stashed changes

    const { data: items = [], isLoading, isError } = useEvents(params);

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
            />
        </div>
    );
}
