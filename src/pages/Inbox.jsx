import { useEffect, useMemo, useRef, useState } from "react";
import { Avatar, Button, Card, Col, Empty, Input, List, Row, Select, Space, Typography, message } from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/apiClient.js";
import useAuth from "../hooks/useAuth.js";
import SockJS from "sockjs-client/dist/sockjs";
import { Client } from "@stomp/stompjs";
import { UserOutlined } from "@ant-design/icons";

const { Text } = Typography;

function formatDate(value) {
    if (!value) return "";
    return new Date(value).toLocaleString();
}

export default function Inbox() {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const [messageApi, contextHolder] = message.useMessage();
    const userId = user?.id;

    const [userSearch, setUserSearch] = useState("");
    const [selectedPeer, setSelectedPeer] = useState(null);
    const [draft, setDraft] = useState("");
    const clientRef = useRef(null);

    const { data: conversations = [] } = useQuery({
        queryKey: ["chat-conversations", userId],
        enabled: !!userId,
        queryFn: async () => {
            const res = await api.get(`/chat/conversations/${userId}`);
            return res.data;
        },
    });

    const { data: thread = [] } = useQuery({
        queryKey: ["chat-thread", userId, selectedPeer?.peerId],
        enabled: !!userId && !!selectedPeer?.peerId,
        queryFn: async () => {
            const res = await api.get(`/chat/thread/${userId}/${selectedPeer.peerId}`);
            return res.data;
        },
    });

    const { data: userOptions = [] } = useQuery({
        queryKey: ["chat-peers", userId, userSearch],
        enabled: !!userId,
        queryFn: async () => {
            const res = await api.get(`/chat/peers/${userId}`);
            const items = Array.isArray(res.data) ? res.data : [];
            const query = (userSearch || "").toLowerCase();
            return items
                .filter((u) => {
                    if (!query) return true;
                    const label = `${u.username} ${u.name || ""} ${u.surname || ""}`.toLowerCase();
                    return label.includes(query);
                })
                .map((u) => ({
                    value: u.id,
                    label: `@${u.username} ${u.name ? `(${u.name} ${u.surname || ""})` : ""}`.trim(),
                    peer: u,
                }));
        },
    });

    useEffect(() => {
        if (!userId) return undefined;
        let socket;
        try {
            socket = new SockJS("http://localhost:8080/ws");
        } catch (err) {
            messageApi.error("Errore inizializzazione chat");
            return undefined;
        }

        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 3000,
        });

        client.onConnect = () => {
            client.subscribe(`/topic/chat/${userId}`, (message) => {
                try {
                    const payload = JSON.parse(message.body);
                    const peerId =
                        String(payload.senderId) === String(userId)
                            ? payload.receiverId
                            : payload.senderId;
                    if (String(selectedPeer?.peerId) === String(peerId)) {
                        queryClient.invalidateQueries({ queryKey: ["chat-thread", userId, peerId] });
                    }
                    queryClient.invalidateQueries({ queryKey: ["chat-conversations", userId] });
                } catch {
                    // ignore parse errors
                }
            });
        };

        client.onStompError = () => {
            messageApi.error("Errore WebSocket");
        };

        client.activate();
        clientRef.current = client;

        return () => {
            client.deactivate();
        };
    }, [userId, selectedPeer, queryClient, messageApi]);

    const handleSend = () => {
        if (!draft.trim() || !selectedPeer?.peerId || !userId) return;
        clientRef.current?.publish({
            destination: "/app/chat.send",
            body: JSON.stringify({
                senderId: userId,
                receiverId: selectedPeer.peerId,
                content: draft.trim(),
            }),
        });
        setDraft("");
    };

    const handleStartChat = (peerId) => {
        if (!peerId) return;
        const peer = userOptions.find((opt) => String(opt.value) === String(peerId))?.peer;
        if (!peer) return;
        setSelectedPeer({
            peerId: peer.id,
            peerUsername: peer.username,
            peerImage: peer.profileImage,
        });
    };

    const conversationList = useMemo(() => conversations, [conversations]);

    return (
        <div style={{ padding: 24 }}>
            {contextHolder}
            <Row gutter={16}>
                <Col xs={24} md={8}>
                    <Card title="Conversazioni" style={{ marginBottom: 16 }}>
                        <Select
                            showSearch
                            placeholder="Nuova chat"
                            options={userOptions}
                            filterOption={false}
                            onSearch={(value) => setUserSearch(value)}
                            onChange={(value) => handleStartChat(value)}
                            style={{ width: "100%", marginBottom: 12 }}
                        />
                        {conversationList.length === 0 ? (
                            <Empty description="Nessuna conversazione" />
                        ) : (
                            <List
                                dataSource={conversationList}
                                renderItem={(item) => (
                                    <List.Item
                                        onClick={() => setSelectedPeer(item)}
                                        style={{
                                            cursor: "pointer",
                                            background:
                                                String(selectedPeer?.peerId) === String(item.peerId)
                                                    ? "#f0f5ff"
                                                    : "transparent",
                                        }}
                                    >
                                        <List.Item.Meta
                                            avatar={
                                                <Avatar
                                                    icon={<UserOutlined />}
                                                    src={item.peerImage || null}
                                                />
                                            }
                                            title={`@${item.peerUsername}`}
                                            description={item.lastMessage}
                                        />
                                        <Text type="secondary">{formatDate(item.lastMessageAt)}</Text>
                                    </List.Item>
                                )}
                            />
                        )}
                    </Card>
                </Col>
                <Col xs={24} md={16}>
                    <Card
                        title={selectedPeer ? `Chat con @${selectedPeer.peerUsername}` : "Seleziona una chat"}
                    >
                        {!selectedPeer ? (
                            <Empty description="Seleziona un utente per iniziare" />
                        ) : (
                            <>
                                <div style={{ maxHeight: 420, overflowY: "auto", marginBottom: 12 }}>
                                    {thread.length === 0 ? (
                                        <Empty description="Nessun messaggio" />
                                    ) : (
                                        <List
                                            dataSource={thread}
                                            renderItem={(msg) => {
                                                const isMine = String(msg.senderId) === String(userId);
                                                return (
                                                    <List.Item style={{ justifyContent: isMine ? "flex-end" : "flex-start" }}>
                                                        <div
                                                            style={{
                                                                background: isMine ? "#1677ff" : "#f5f5f5",
                                                                color: isMine ? "#fff" : "#222",
                                                                padding: "8px 12px",
                                                                borderRadius: 12,
                                                                maxWidth: "70%",
                                                            }}
                                                        >
                                                            <Text style={{ color: isMine ? "#fff" : "#222" }}>
                                                                {msg.content}
                                                            </Text>
                                                            <div style={{ fontSize: 11, opacity: 0.7 }}>
                                                                {formatDate(msg.createdAt)}
                                                            </div>
                                                        </div>
                                                    </List.Item>
                                                );
                                            }}
                                        />
                                    )}
                                </div>
                                <Space style={{ width: "100%" }}>
                                    <Input
                                        placeholder="Scrivi un messaggio..."
                                        value={draft}
                                        onChange={(e) => setDraft(e.target.value)}
                                        onPressEnter={handleSend}
                                    />
                                    <Button type="primary" onClick={handleSend}>
                                        Invia
                                    </Button>
                                </Space>
                            </>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
