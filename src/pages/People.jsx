import { useState } from "react";
import { Button, Card, Col, Empty, Input, List, Row, Skeleton } from "antd";
import { useNavigate } from "react-router-dom";
import { useInfiniteUsers } from "../queries/users.queries";
import UserCard from "../components/user/UserCard";

export default function People() {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const { data, status, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteUsers({
        q: query,
    });

    const users = data?.pages?.flatMap((page) => page.items) ?? [];

    const isPending = status === "pending";
    const isSuccess = status === "success";

    return (
        <div style={{ padding: 24 }}>
            <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 12 }}>
                <Col xs={24} md={12}>
                    <Input.Search
                        placeholder="Cerca per nome, cognome o username…"
                        allowClear
                        enterButton="Cerca"
                        onSearch={setQuery}
                    />
                </Col>
            </Row>

            {isPending && (
                <Card>
                    <Skeleton active />
                </Card>
            )}

            {isSuccess && users.length === 0 && (
                <Card>
                    <Empty description="Nessun utente trovato" />
                </Card>
            )}

            {isSuccess && users.length > 0 && (
                <List
                    grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
                    dataSource={users}
                    renderItem={(user) => (
                        <List.Item key={user.id}>
                            <UserCard u={user} onOpen={(id) => navigate(`/users/${id}`)} />
                        </List.Item>
                    )}
                />
            )}

            {hasNextPage && (
                <div style={{ textAlign: "center", marginTop: 12 }}>
                    <Button onClick={fetchNextPage} loading={isFetchingNextPage}>
                        {isFetchingNextPage ? "Carico..." : "Carica altri"}
                    </Button>
                </div>
            )}
        </div>
    );
}
