import React from "react";
import { Card, List, Button, Empty, Skeleton } from "antd";
import CustomCard from "./Card.jsx";

export default function CustomList({
                                       items,
                                       isLoading,
                                       isError,
                                       grid,
                                       onItemClick,
                                       onToggleLike,
                                       onToggleBookmark,
                                       likingIds,
                                       hasNextPage,
                                       isFetchingNextPage,
                                       onLoadMore,
                                   }) {
    if (isLoading) {
        return (
            <div style={{ marginTop: 16 }}>
                <Card>
                    <Skeleton active />
                    <Skeleton active />
                </Card>
            </div>
        );
    }

    if (isError) {
        return (
            <div style={{ marginTop: 16 }}>
                <Card>
                    <Empty description="Errore nel caricamento" />
                </Card>
            </div>
        );
    }

    if (!items?.length) {
        return (
            <div style={{ marginTop: 16 }}>
                <Card>
                    <Empty description="Nessun evento trovato" />
                </Card>
            </div>
        );
    }

    return (
        <div style={{ marginTop: 16 }}>
            <List
                itemLayout="vertical"
                dataSource={items}
                grid={grid}
                renderItem={(ev) => (
                    <List.Item key={ev.id}>
                        <CustomCard
                            ev={ev}
                            onClick={() => onItemClick?.(ev.id)}
                            onToggleLike={onToggleLike ? () => onToggleLike(ev) : undefined}
                            onToggleBookmark={onToggleBookmark ? () => onToggleBookmark(ev) : undefined}
                            isLiking={Boolean(likingIds?.includes(ev.id))}
                        />
                    </List.Item>
                )}
            />

            {hasNextPage && (
                <div style={{ textAlign: "center", marginTop: 12 }}>
                    <Button onClick={onLoadMore} loading={isFetchingNextPage}>
                        {isFetchingNextPage ? "Carico..." : "Carica altri"}
                    </Button>
                </div>
            )}
        </div>
    );
}
