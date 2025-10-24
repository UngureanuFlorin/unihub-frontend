import React, { useState } from "react";
import { Row, Col, Input, List, Button, Card, Empty, Skeleton } from "antd";
import { useNavigate } from "react-router-dom";
import { useInfiniteUsers } from "../queries/users.queries";
import UserCard from "../components/user/UserCard";

export default function People() {
    const [q, setQ] = useState("");
    const navigate = useNavigate();

    const { data, status, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteUsers({ q });

    const items = data?.pages?.flatMap((p) => p.items) ?? [];

    return (
        <div style={{ padding: 24 }}>
            <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 12 }}>
                <Col xs={24} md={12}>
                    <Input.Search
                        placeholder="Cerca per nome, cognome o username…"
                        allowClear
                        enterButton="Cerca"
                        onSearch={setQ}
                    />
                </Col>
            </Row>

            {status === "pending" && (
                <Card>
                    <Skeleton active />
                </Card>
            )}

            {status === "success" && items.length === 0 && (
                <Card>
                    <Empty description="Nessun utente trovato" />
                </Card>
            )}

            {status === "success" && items.length > 0 && (
                <List
                    grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
                    dataSource={items}
                    renderItem={(u) => (
                        <List.Item key={u.id}>
                            <UserCard u={u} onOpen={(id) => navigate(`/profile/${id}`)} />
                        </List.Item>
                    )}
                />

            )}

            {hasNextPage && (
                <div style={{ textAlign: "center", marginTop: 12 }}>
                    <Button onClick={() => fetchNextPage()} loading={isFetchingNextPage}>
                        {isFetchingNextPage ? "Carico..." : "Carica altri"}
                    </Button>
                </div>
            )}
        </div>
    );
}
