import { useMemo, useState } from "react";
import {
    Badge,
    Button,
    Calendar,
    Card,
    Col,
    Empty,
    Input,
    Modal,
    List,
    DatePicker,
    Row,
    Select,
    Space,
    Tabs,
    Tag,
    Typography,
    message,
} from "antd";
import { CalendarOutlined, SettingOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import useAuth from "../hooks/useAuth.js";
import { useUniversitaList, useDipartimenti } from "../queries/universita.queries.js";
import { useAule, useLezioni, useMaterie } from "../queries/lessons.queries.js";
import {
    useCreateAula,
    useCreateLezione,
    useCreateMateria,
    useDeleteAula,
    useDeleteLezione,
    useDeleteMateria,
    useUpdateLezione,
} from "../queries/lessons.mutations.js";

const { Text, Title } = Typography;

function formatTime(value) {
    if (!value) return "";
    return value.slice(0, 5);
}

function toDateKey(value) {
    if (!value) return "";
    return value.slice(0, 10);
}

function formatDateLabel(value) {
    if (!value) return "";
    return dayjs(value).format("DD/MM/YYYY");
}

const MONTH_OPTIONS = Array.from({ length: 12 }).map((_, index) => ({
    value: index,
    label: dayjs().month(index).format("MMMM"),
}));

const YEAR_OPTIONS = Array.from({ length: 5 }).map((_, index) => {
    const year = dayjs().year() - 2 + index;
    return { value: year, label: String(year) };
});

export default function Lessons() {
    const { user } = useAuth();
    const isAdmin = user?.role === "ADMIN";
    const [messageApi, contextHolder] = message.useMessage();

    const [filters, setFilters] = useState({
        materiaId: null,
        aulaId: null,
    });

    const { data: materie = [] } = useMaterie();
    const { data: aule = [] } = useAule();
    const { data: lezioni = [], isLoading } = useLezioni();

    const { data: universita = [] } = useUniversitaList();
    const [selectedUniId, setSelectedUniId] = useState(null);
    const { data: dipartimenti = [] } = useDipartimenti(selectedUniId);

    const createMateria = useCreateMateria();
    const deleteMateria = useDeleteMateria();
    const createAula = useCreateAula();
    const deleteAula = useDeleteAula();
    const createLezione = useCreateLezione();
    const deleteLezione = useDeleteLezione();
    const updateLezione = useUpdateLezione();

    const [materiaForm, setMateriaForm] = useState({
        nome: "",
        codice: "",
        corsoDiStudi: "",
        dipartimentoId: null,
    });
    const [aulaForm, setAulaForm] = useState({
        nome: "",
        edificio: "",
        capienza: "",
        universitaId: null,
    });
    const [lezioneForm, setLezioneForm] = useState({
        materiaId: null,
        aulaId: null,
        docente: "",
        data: dayjs(),
        oraInizio: "09:00",
        oraFine: "11:00",
        note: "",
    });

    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [editLesson, setEditLesson] = useState(null);
    const [editForm, setEditForm] = useState({
        materiaId: null,
        aulaId: null,
        docente: "",
        data: null,
        oraInizio: "",
        oraFine: "",
        note: "",
    });

    const filteredLessons = useMemo(() => {
        return lezioni.filter((lezione) => {
            if (filters.materiaId && lezione.materiaId !== filters.materiaId) return false;
            if (filters.aulaId && lezione.aulaId !== filters.aulaId) return false;
            return true;
        });
    }, [lezioni, filters]);

    const lessonsByDate = useMemo(() => {
        const map = new Map();
        filteredLessons.forEach((lezione) => {
            const key = toDateKey(lezione.data);
            if (!map.has(key)) {
                map.set(key, []);
            }
            map.get(key).push(lezione);
        });
        return map;
    }, [filteredLessons]);

    const selectedLessons = useMemo(() => {
        const key = selectedDate.format("YYYY-MM-DD");
        return lessonsByDate.get(key) || [];
    }, [lessonsByDate, selectedDate]);

    const calendarContent = (
        <Card>
            <Space wrap style={{ marginBottom: 16 }}>
                <Select
                    allowClear
                    placeholder="Materia"
                    style={{ minWidth: 180 }}
                    value={filters.materiaId}
                    options={materie.map((m) => ({ value: m.id, label: m.nome }))}
                    onChange={(value) => setFilters((prev) => ({ ...prev, materiaId: value }))}
                />
                <Select
                    allowClear
                    placeholder="Aula"
                    style={{ minWidth: 180 }}
                    value={filters.aulaId}
                    options={aule.map((a) => ({ value: a.id, label: a.nome }))}
                    onChange={(value) => setFilters((prev) => ({ ...prev, aulaId: value }))}
                />
                <Select
                    placeholder="Mese"
                    style={{ minWidth: 150 }}
                    value={selectedDate.month()}
                    options={MONTH_OPTIONS}
                    onChange={(value) => setSelectedDate((prev) => prev.month(value).date(1))}
                />
                <Select
                    placeholder="Anno"
                    style={{ minWidth: 120 }}
                    value={selectedDate.year()}
                    options={YEAR_OPTIONS}
                    onChange={(value) => setSelectedDate((prev) => prev.year(value).date(1))}
                />
            </Space>

            {isLoading ? (
                <Text>Caricamento lezioni...</Text>
            ) : filteredLessons.length === 0 ? (
                <Empty description="Nessuna lezione trovata" />
            ) : (
                <Row gutter={[16, 16]}>
                    <Col xs={24} lg={14}>
                        <Calendar
                            value={selectedDate}
                            onSelect={(value) => setSelectedDate(value)}
                            dateCellRender={(value) => {
                                const key = value.format("YYYY-MM-DD");
                                const items = lessonsByDate.get(key) || [];
                                if (!items.length) return null;
                                return (
                                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                        {items.slice(0, 3).map((item) => (
                                            <li key={item.id}>
                                                <Tag color="geekblue" style={{ marginBottom: 4 }}>
                                                    {formatTime(item.oraInizio)} {item.materiaNome}
                                                </Tag>
                                            </li>
                                        ))}
                                        {items.length > 3 && (
                                            <Text type="secondary">+{items.length - 3}</Text>
                                        )}
                                    </ul>
                                );
                            }}
                        />
                    </Col>
                    <Col xs={24} lg={10}>
                        <Card
                            size="small"
                            title={
                                <Space>
                                    <CalendarOutlined />
                                    Lezioni del {selectedDate.format("DD/MM/YYYY")}
                                    <Badge count={selectedLessons.length} />
                                </Space>
                            }
                        >
                            <List
                                dataSource={selectedLessons}
                                locale={{ emptyText: "Nessuna lezione" }}
                                renderItem={(lezione) => (
                                    <List.Item>
                                        <Space direction="vertical" size={4}>
                                            <Text strong>
                                                {formatTime(lezione.oraInizio)} - {formatTime(lezione.oraFine)}
                                            </Text>
                                            <Text>{lezione.materiaNome}</Text>
                                            <Space wrap>
                                                <Tag color="geekblue">{lezione.aulaNome}</Tag>
                                                {lezione.docente && <Tag>{lezione.docente}</Tag>}
                                            </Space>
                                            {lezione.note && (
                                                <Text type="secondary">{lezione.note}</Text>
                                            )}
                                        </Space>
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>
                </Row>
            )}
        </Card>
    );

    const adminContent = (
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Card title="Materie">
                <Space wrap style={{ marginBottom: 12 }}>
                    <Input
                        placeholder="Nome"
                        value={materiaForm.nome}
                        onChange={(e) => setMateriaForm((prev) => ({ ...prev, nome: e.target.value }))}
                    />
                    <Input
                        placeholder="Codice"
                        value={materiaForm.codice}
                        onChange={(e) => setMateriaForm((prev) => ({ ...prev, codice: e.target.value }))}
                    />
                    <Input
                        placeholder="Corso di studi"
                        value={materiaForm.corsoDiStudi}
                        onChange={(e) => setMateriaForm((prev) => ({ ...prev, corsoDiStudi: e.target.value }))}
                    />
                    <Select
                        allowClear
                        placeholder="Universita"
                        style={{ minWidth: 160 }}
                        value={selectedUniId}
                        options={universita.map((u) => ({ value: u.id, label: u.nome }))}
                        onChange={(value) => {
                            setSelectedUniId(value);
                            setMateriaForm((prev) => ({ ...prev, dipartimentoId: null }));
                        }}
                    />
                    <Select
                        allowClear
                        placeholder="Dipartimento"
                        style={{ minWidth: 180 }}
                        value={materiaForm.dipartimentoId}
                        options={dipartimenti.map((d) => ({ value: d.id, label: d.nome }))}
                        onChange={(value) => setMateriaForm((prev) => ({ ...prev, dipartimentoId: value }))}
                        disabled={!selectedUniId}
                    />
                    <Button
                        type="primary"
                        loading={createMateria.isPending}
                        onClick={async () => {
                            try {
                                await createMateria.mutateAsync({
                                    nome: materiaForm.nome,
                                    codice: materiaForm.codice,
                                    corsoDiStudi: materiaForm.corsoDiStudi,
                                    dipartimentoId: materiaForm.dipartimentoId,
                                });
                                setMateriaForm({ nome: "", codice: "", corsoDiStudi: "", dipartimentoId: null });
                                messageApi.success("Materia aggiunta");
                            } catch (err) {
                                messageApi.error(String(err?.response?.data || "Errore creazione"));
                            }
                        }}
                    >
                        Aggiungi
                    </Button>
                </Space>
                <List
                    bordered
                    dataSource={materie}
                    locale={{ emptyText: "Nessuna materia" }}
                    renderItem={(item) => (
                        <List.Item
                            actions={[
                                <Button
                                    key="edit"
                                    size="small"
                                    onClick={() => {
                                        setEditLesson(item);
                                        setEditForm({
                                            materiaId: item.materiaId,
                                            aulaId: item.aulaId,
                                            docente: item.docente || "",
                                            data: item.data ? dayjs(item.data) : null,
                                            oraInizio: item.oraInizio || "",
                                            oraFine: item.oraFine || "",
                                            note: item.note || "",
                                        });
                                    }}
                                >
                                    Modifica
                                </Button>,
                                <Button
                                    key="delete"
                                    danger
                                    size="small"
                                    loading={deleteMateria.isPending}
                                    onClick={() => deleteMateria.mutate(item.id)}
                                >
                                    Elimina
                                </Button>,
                            ]}
                        >
                            <Space direction="vertical" size={0}>
                                <Text strong>{item.nome}</Text>
                                <Text type="secondary">{item.codice}</Text>
                            </Space>
                        </List.Item>
                    )}
                />
            </Card>

            <Card title="Aule">
                <Space wrap style={{ marginBottom: 12 }}>
                    <Input
                        placeholder="Nome aula"
                        value={aulaForm.nome}
                        onChange={(e) => setAulaForm((prev) => ({ ...prev, nome: e.target.value }))}
                    />
                    <Input
                        placeholder="Edificio"
                        value={aulaForm.edificio}
                        onChange={(e) => setAulaForm((prev) => ({ ...prev, edificio: e.target.value }))}
                    />
                    <Input
                        placeholder="Capienza"
                        type="number"
                        value={aulaForm.capienza}
                        onChange={(e) => setAulaForm((prev) => ({ ...prev, capienza: e.target.value }))}
                    />
                    <Select
                        allowClear
                        placeholder="Universita"
                        style={{ minWidth: 180 }}
                        value={aulaForm.universitaId}
                        options={universita.map((u) => ({ value: u.id, label: u.nome }))}
                        onChange={(value) => setAulaForm((prev) => ({ ...prev, universitaId: value }))}
                    />
                    <Button
                        type="primary"
                        loading={createAula.isPending}
                        onClick={async () => {
                            try {
                                await createAula.mutateAsync({
                                    nome: aulaForm.nome,
                                    edificio: aulaForm.edificio,
                                    capienza: aulaForm.capienza ? Number(aulaForm.capienza) : null,
                                    universitaId: aulaForm.universitaId,
                                });
                                setAulaForm({ nome: "", edificio: "", capienza: "", universitaId: null });
                                messageApi.success("Aula aggiunta");
                            } catch (err) {
                                messageApi.error(String(err?.response?.data || "Errore creazione"));
                            }
                        }}
                    >
                        Aggiungi
                    </Button>
                </Space>
                <List
                    bordered
                    dataSource={aule}
                    locale={{ emptyText: "Nessuna aula" }}
                    renderItem={(item) => (
                        <List.Item
                            actions={[
                                <Button
                                    key="delete"
                                    danger
                                    size="small"
                                    loading={deleteAula.isPending}
                                    onClick={() => deleteAula.mutate(item.id)}
                                >
                                    Elimina
                                </Button>,
                            ]}
                        >
                            <Space direction="vertical" size={0}>
                                <Text strong>{item.nome}</Text>
                                <Text type="secondary">{item.edificio}</Text>
                            </Space>
                        </List.Item>
                    )}
                />
            </Card>

            <Card title="Lezioni">
                <Space wrap style={{ marginBottom: 12 }}>
                    <Select
                        placeholder="Materia"
                        style={{ minWidth: 180 }}
                        value={lezioneForm.materiaId}
                        options={materie.map((m) => ({ value: m.id, label: m.nome }))}
                        onChange={(value) => setLezioneForm((prev) => ({ ...prev, materiaId: value }))}
                    />
                    <Select
                        placeholder="Aula"
                        style={{ minWidth: 160 }}
                        value={lezioneForm.aulaId}
                        options={aule.map((a) => ({ value: a.id, label: a.nome }))}
                        onChange={(value) => setLezioneForm((prev) => ({ ...prev, aulaId: value }))}
                    />
                    <DatePicker
                        placeholder="Data"
                        value={lezioneForm.data}
                        onChange={(value) => setLezioneForm((prev) => ({ ...prev, data: value }))}
                    />
                    <Input
                        placeholder="Docente"
                        value={lezioneForm.docente}
                        onChange={(e) => setLezioneForm((prev) => ({ ...prev, docente: e.target.value }))}
                    />
                    <Input
                        type="time"
                        value={lezioneForm.oraInizio}
                        onChange={(e) => setLezioneForm((prev) => ({ ...prev, oraInizio: e.target.value }))}
                    />
                    <Input
                        type="time"
                        value={lezioneForm.oraFine}
                        onChange={(e) => setLezioneForm((prev) => ({ ...prev, oraFine: e.target.value }))}
                    />
                    <Input
                        placeholder="Note"
                        value={lezioneForm.note}
                        onChange={(e) => setLezioneForm((prev) => ({ ...prev, note: e.target.value }))}
                    />
                    <Button
                        type="primary"
                        loading={createLezione.isPending}
                        onClick={async () => {
                            try {
                                await createLezione.mutateAsync({
                                    materiaId: lezioneForm.materiaId,
                                    aulaId: lezioneForm.aulaId,
                                    docente: lezioneForm.docente,
                                    data: lezioneForm.data ? lezioneForm.data.format("YYYY-MM-DD") : null,
                                    oraInizio: lezioneForm.oraInizio,
                                    oraFine: lezioneForm.oraFine,
                                    note: lezioneForm.note,
                                });
                                messageApi.success("Lezione aggiunta");
                            } catch (err) {
                                messageApi.error(String(err?.response?.data || "Errore creazione"));
                            }
                        }}
                    >
                        Aggiungi
                    </Button>
                </Space>
                <List
                    bordered
                    dataSource={lezioni}
                    locale={{ emptyText: "Nessuna lezione" }}
                    renderItem={(item) => (
                        <List.Item
                            actions={[
                                <Button
                                    key="delete"
                                    danger
                                    size="small"
                                    loading={deleteLezione.isPending}
                                    onClick={() => deleteLezione.mutate(item.id)}
                                >
                                    Elimina
                                </Button>,
                            ]}
                        >
                            <Space direction="vertical" size={0}>
                                <Text strong>{item.materiaNome}</Text>
                                <Text type="secondary">
                                    {formatDateLabel(item.data)} {formatTime(item.oraInizio)} - {formatTime(item.oraFine)}
                                </Text>
                                <Text type="secondary">{item.aulaNome}</Text>
                            </Space>
                        </List.Item>
                    )}
                />
            </Card>
        </Space>
    );

    const editModal = (
        <Modal
            title="Modifica lezione"
            open={Boolean(editLesson)}
            onCancel={() => setEditLesson(null)}
            onOk={async () => {
                try {
                    await updateLezione.mutateAsync({
                        id: editLesson.id,
                        payload: {
                            materiaId: editForm.materiaId,
                            aulaId: editForm.aulaId,
                            docente: editForm.docente,
                            data: editForm.data ? editForm.data.format("YYYY-MM-DD") : null,
                            oraInizio: editForm.oraInizio,
                            oraFine: editForm.oraFine,
                            note: editForm.note,
                        },
                    });
                    messageApi.success("Lezione aggiornata");
                    setEditLesson(null);
                } catch (err) {
                    messageApi.error(String(err?.response?.data || "Errore aggiornamento"));
                }
            }}
            okText="Salva"
            confirmLoading={updateLezione.isPending}
        >
            <Space direction="vertical" style={{ width: "100%" }}>
                <Select
                    placeholder="Materia"
                    value={editForm.materiaId}
                    options={materie.map((m) => ({ value: m.id, label: m.nome }))}
                    onChange={(value) => setEditForm((prev) => ({ ...prev, materiaId: value }))}
                />
                <Select
                    placeholder="Aula"
                    value={editForm.aulaId}
                    options={aule.map((a) => ({ value: a.id, label: a.nome }))}
                    onChange={(value) => setEditForm((prev) => ({ ...prev, aulaId: value }))}
                />
                <DatePicker
                    value={editForm.data}
                    onChange={(value) => setEditForm((prev) => ({ ...prev, data: value }))}
                />
                <Input
                    placeholder="Docente"
                    value={editForm.docente}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, docente: e.target.value }))}
                />
                <Space>
                    <Input
                        type="time"
                        value={editForm.oraInizio}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, oraInizio: e.target.value }))}
                    />
                    <Input
                        type="time"
                        value={editForm.oraFine}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, oraFine: e.target.value }))}
                    />
                </Space>
                <Input
                    placeholder="Note"
                    value={editForm.note}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, note: e.target.value }))}
                />
            </Space>
        </Modal>
    );

    return (
        <div style={{ padding: 24 }}>
            {contextHolder}
            <Title level={3}>Orario lezioni</Title>
            {editModal}
            <Tabs
                defaultActiveKey="calendar"
                items={[
                    {
                        key: "calendar",
                        label: (
                            <Space>
                                <CalendarOutlined />
                                Calendario
                            </Space>
                        ),
                        children: calendarContent,
                    },
                    ...(isAdmin
                        ? [
                            {
                                key: "manage",
                                label: (
                                    <Space>
                                        <SettingOutlined />
                                        Gestione
                                    </Space>
                                ),
                                children: adminContent,
                            },
                        ]
                        : []),
                ]}
            />
        </div>
    );
}
