function mockItems(page, limit) {
    const start = (page - 1) * limit + 1;
    return Array.from({ length: limit }, (_, i) => {
        const id = start + i;
        return {
            id: String(id),
            title: `Evento #${id}`,
            summary: "Breve descrizione dell'evento.",
            description: "Descrizione più estesa dell'evento.",
            date: "2025-10-05 15:00",
            datePretty: "5 Ott 2025, 15:00",
            category: ["accademico", "sport", "cultura"][id % 3],
            university: ["UniMi", "PoliMi", "UniTo"][id % 3],
            faculty: ["Ingegneria", "Lettere", "Economia"][id % 3],
        };
    });
}

export async function fetchEvents({ page = 1, limit = 9, search, category, university, faculty }) {
    // Simula latenza
    await new Promise((r) => setTimeout(r, 300));
    const items = mockItems(page, limit);

    // Filtri super-semplici lato client (solo per mock)
    let filtered = items;
    if (search) filtered = filtered.filter((x) => x.title.toLowerCase().includes(search.toLowerCase()));
    if (category) filtered = filtered.filter((x) => x.category === category);
    if (university) filtered = filtered.filter((x) => x.university === university);
    if (faculty) filtered = filtered.filter((x) => x.faculty === faculty);

    return {
        items: filtered,
        page,
        hasNextPage: page < 4, // 4 pagine mock
        total: 4 * limit,
    };
}

export async function fetchEventById(id) {
    // mock singolo evento
    return {
        id,
        title: `Evento #${id}`,
        summary: "Breve descrizione dell'evento.",
        description: "Descrizione più estesa dell'evento (singolo).",
        date: "2025-10-05 15:00",
        datePretty: "5 Ott 2025, 15:00",
        category: "accademico",
        university: "UniMi",
        faculty: "Ingegneria",
        average: 4.5,
        comments: [{ id: "c1", author: "Mario", text: "Ottimo evento!" }],
    };
}
