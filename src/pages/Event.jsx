import React, { useMemo } from "react";
import {
    Typography,
    Input,
    Select,
    DatePicker,
    Row,
    Col,
    Card,
    List,
    Button,
    Empty,
    Skeleton,
    Space,
    Tag,
} from "antd";
import { useInfiniteEvents } from "../queries/events.queries";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

function Event() {
    const navigate = useNavigate();

    // stato filtri base (puoi collegare a useState se vuoi filtri controllati)
    const params = useMemo(
        () => ({ search: "", category: "", university: "", faculty: "" }),
        []
    );

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
        isLoading,
        isError,
    } = useInfiniteEvents(params);

    const items = data?.pages?.flatMap((p) => p.items) ?? [];

    return (
        <div style={{ padding: 24 }}>
            {/* HERO */}
            <Row gutter={[24, 24]} align="middle">
                <Col xs={24} md={14}>
                    <Title level={2} style={{ marginBottom: 8 }}>
            <span
                style={{
                    background: "linear-gradient(90deg, #00d2ff 0%, #3a47d5 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontWeight: 700,
                }}
            >
              UniHub
            </span>{" "}
                        — scopri gli eventi
                    </Title>
                    <Text type="secondary">
                        Filtra per ateneo, categoria e data. Clicca un evento per i dettagli.
                    </Text>
                </Col>
                <Col xs={24} md={10}>
                    <Input.Search
                        placeholder="Cerca per titolo, parola chiave…"
                        allowClear
                        enterButton="Cerca"
                        onSearch={(q) => {
                            // TODO: collega al tuo stato filtri e refetch
                            console.log("search:", q);
                        }}
                    />
                </Col>
            </Row>

            {/* FILTRI RAPIDI */}
            <Card style={{ marginTop: 16 }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={8}>
                        <Select
                            style={{ width: "100%" }}
                            placeholder="Categoria"
                            options={[
                                { value: "", label: "Tutte le categorie" },
                                { value: "accademico", label: "Accademico" },
                                { value: "sport", label: "Sport" },
                                { value: "cultura", label: "Cultura" },
                                { value: "carriera", label: "Carriera" },
                                { value: "volontariato", label: "Volontariato" },
                            ]}
                            onChange={(v) => console.log("category:", v)}
                        />
                    </Col>
                    <Col xs={24} md={8}>
                        <Select
                            style={{ width: "100%" }}
                            placeholder="Ateneo"
                            options={[
                                { value: "", label: "Tutti gli atenei" },
                                { value: "unimi", label: "Università degli Studi di Milano" },
                                { value: "polimi", label: "Politecnico di Milano" },
                            ]}
                            onChange={(v) => console.log("university:", v)}
                        />
                    </Col>
                    <Col xs={24} md={8}>
                        <RangePicker
                            style={{ width: "100%" }}
                            showTime
                            onChange={(v) => console.log("dateRange:", v)}
                        />
                    </Col>
                </Row>

                <Space size="small" style={{ marginTop: 12 }}>
                    <Tag onClick={() => console.log("hackathon")} color="blue" style={{ cursor: "pointer" }}>
                        #hackathon
                    </Tag>
                    <Tag onClick={() => console.log("jobfair")} color="green" style={{ cursor: "pointer" }}>
                        #jobfair
                    </Tag>
                    <Tag onClick={() => console.log("musica")} color="magenta" style={{ cursor: "pointer" }}>
                        #musica
                    </Tag>
                </Space>
            </Card>

            {/* LISTA EVENTI */}
            <div style={{ marginTop: 16 }}>
                {isLoading && (
                    <Card>
                        <Skeleton active />
                        <Skeleton active />
                    </Card>
                )}

                {isError && (
                    <Card>
                        <Empty description="Errore nel caricamento" />
                    </Card>
                )}

                {!isLoading && !isError && items.length === 0 && (
                    <Card>
                        <Empty description="Nessun evento trovato" />
                    </Card>
                )}

                {!isLoading && !isError && items.length > 0 && (
                    <List
                        itemLayout="vertical"
                        dataSource={items}
                        renderItem={(ev) => (
                            <List.Item key={ev.id}>
                                <Card
                                    hoverable
                                    title={ev.title}
                                    extra={<Text type="secondary">{ev.datePretty || ev.date}</Text>}
                                    onClick={() => navigate(`/events/${ev.id}`)}
                                    style={{ width: "100%" }}
                                >
                                    <div style={{ minHeight: 48 }}>{ev.summary || ev.description}</div>
                                    <Space size={8} style={{ marginTop: 12 }}>
                                        {ev.category && <Tag>{ev.category}</Tag>}
                                        {ev.university && <Tag color="geekblue">{ev.university}</Tag>}
                                        {ev.faculty && <Tag color="purple">{ev.faculty}</Tag>}
                                    </Space>
                                </Card>
                            </List.Item>
                        )}
                    />
                )}

                {/* Paginazione progressiva */}
                {hasNextPage && (
                    <div style={{ textAlign: "center", marginTop: 12 }}>
                        <Button onClick={() => fetchNextPage()} loading={isFetchingNextPage}>
                            {isFetchingNextPage ? "Carico..." : "Carica altri"}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Event;
