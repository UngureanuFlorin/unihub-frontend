import { useMemo, useState } from "react";
import {
    Avatar,
    Button,
    Card,
    Divider,
    Empty,
    Image,
    Input,
    List,
    message,
    Popconfirm,
    Space,
    Tabs,
    Typography,
    Upload,
} from "antd";
import {
    DeleteOutlined,
    HeartFilled,
    HeartOutlined,
    SendOutlined,
    UploadOutlined,
    UserOutlined,
    BookOutlined,
    BookFilled,
} from "@ant-design/icons";
import useAuth from "../hooks/useAuth.js";
import { useFeedPosts } from "../queries/posts.queries.js";
import {
    useAddPostComment,
    useCreatePost,
    useDeletePostComment,
    useLikePost,
    useUnlikePost,
} from "../queries/posts.mutations.js";
import { useSavedPosts } from "../queries/bookmarks.queries.js";
import { useRemovePostBookmark, useSavePostBookmark } from "../queries/bookmarks.mutations.js";

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Errore lettura immagine"));
        reader.readAsDataURL(file);
    });
}

function formatDate(value) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleString("it-IT", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function Feed() {
    const { user } = useAuth();
    const { data: posts = [], isLoading, isError } = useFeedPosts();
    const { data: savedPosts = [] } = useSavedPosts();
    const createPost = useCreatePost();
    const likePost = useLikePost();
    const unlikePost = useUnlikePost();
    const addComment = useAddPostComment();
    const deleteComment = useDeletePostComment();
    const savePostBookmark = useSavePostBookmark();
    const removePostBookmark = useRemovePostBookmark();
    const [messageApi, contextHolder] = message.useMessage();

    const [content, setContent] = useState("");
    const [imageFileList, setImageFileList] = useState([]);
    const [imageData, setImageData] = useState(null);
    const [commentDrafts, setCommentDrafts] = useState({});
    const [openComments, setOpenComments] = useState({});
    const [savedSearch, setSavedSearch] = useState("");

    const savedPostIds = useMemo(
        () => new Set(savedPosts.map((post) => String(post.id))),
        [savedPosts]
    );
    const sortedPosts = useMemo(
        () =>
            posts.map((post) => ({
                ...post,
                isBookmarked: savedPostIds.has(String(post.id)),
            })),
        [posts, savedPostIds]
    );

    const filteredSavedPosts = useMemo(() => {
        const query = savedSearch.trim().toLowerCase();
        return savedPosts.filter((post) => {
            if (!query) return true;
            return post.content?.toLowerCase().includes(query)
                || post.authorUsername?.toLowerCase().includes(query);
        });
    }, [savedPosts, savedSearch]);

    const handleCreatePost = async () => {
        if (!user?.id) {
            messageApi.error("Devi essere loggato");
            return;
        }
        if (!content.trim()) {
            messageApi.warning("Scrivi qualcosa prima di pubblicare");
            return;
        }

        try {
            await createPost.mutateAsync({
                userId: user.id,
                payload: {
                    content: content.trim(),
                    image: imageData || undefined,
                },
            });
            setContent("");
            setImageFileList([]);
            setImageData(null);
            messageApi.success("Post pubblicato");
        } catch (err) {
            messageApi.error(String(err?.response?.data || "Errore pubblicazione"));
        }
    };

    const handleLikeToggle = (post) => {
        if (!user?.id) {
            messageApi.error("Devi essere loggato");
            return;
        }
        const mutation = post.userLiked ? unlikePost : likePost;
        mutation.mutate(
            { postId: post.id, userId: user.id },
            {
                onError: () => messageApi.error("Errore aggiornamento like"),
            }
        );
    };

    const handleBookmarkToggle = (post) => {
        if (!user?.id) {
            messageApi.error("Devi essere loggato");
            return;
        }
        const mutation = post.isBookmarked ? removePostBookmark : savePostBookmark;
        mutation.mutate(
            { postId: post.id, userId: user.id },
            { onError: () => messageApi.error("Errore salvataggio") }
        );
    };

    const handleAddComment = async (postId) => {
        if (!user?.id) {
            messageApi.error("Devi essere loggato");
            return;
        }
        const contentValue = commentDrafts[postId]?.trim();
        if (!contentValue) {
            messageApi.warning("Scrivi un commento");
            return;
        }

        try {
            await addComment.mutateAsync({ postId, userId: user.id, content: contentValue });
            setCommentDrafts((prev) => ({ ...prev, [postId]: "" }));
        } catch (err) {
            messageApi.error(String(err?.response?.data || "Errore commento"));
        }
    };

    const handleDeleteComment = async (postId, commentId) => {
        if (!user?.id) return;
        try {
            await deleteComment.mutateAsync({ postId, commentId, userId: user.id });
        } catch (err) {
            messageApi.error(String(err?.response?.data || "Errore eliminazione commento"));
        }
    };

    const toggleComments = (postId) => {
        setOpenComments((prev) => ({
            ...prev,
            [postId]: !prev[postId],
        }));
    };

    const feedContent = (
        <>
            <Card title="Feed personale" style={{ marginBottom: 16 }}>
                <TextArea
                    rows={4}
                    placeholder="Condividi un aggiornamento con i tuoi colleghi..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <Space style={{ marginTop: 12 }}>
                    <Upload
                        beforeUpload={() => false}
                        maxCount={1}
                        fileList={imageFileList}
                        onChange={async ({ fileList }) => {
                            setImageFileList(fileList);
                            const file = fileList[0]?.originFileObj;
                            if (!file) {
                                setImageData(null);
                                return;
                            }
                            try {
                                const dataUrl = await fileToDataUrl(file);
                                setImageData(dataUrl);
                            } catch {
                                setImageData(null);
                                messageApi.error("Errore lettura immagine");
                            }
                        }}
                        onRemove={() => {
                            setImageFileList([]);
                            setImageData(null);
                        }}
                    >
                        <Button icon={<UploadOutlined />}>Aggiungi immagine</Button>
                    </Upload>
                    <Button
                        type="primary"
                        icon={<SendOutlined />}
                        loading={createPost.isPending}
                        onClick={handleCreatePost}
                    >
                        Pubblica
                    </Button>
                </Space>
            </Card>

            {isLoading ? (
                <Card>
                    <Paragraph>Caricamento feed...</Paragraph>
                </Card>
            ) : isError ? (
                <Card>
                    <Paragraph>Errore nel caricamento del feed.</Paragraph>
                </Card>
            ) : !sortedPosts.length ? (
                <Card>
                    <Empty description="Nessun post nel feed" />
                </Card>
            ) : (
                <List
                    dataSource={sortedPosts}
                    itemLayout="vertical"
                    renderItem={(post) => (
                        <List.Item key={post.id}>
                            <Card>
                                <Space align="start" size="middle">
                                    <Avatar
                                        size={40}
                                        icon={<UserOutlined />}
                                        src={post.authorImage || null}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <Space direction="vertical" size={4} style={{ width: "100%" }}>
                                            <Space split={<Divider type="vertical" />}>
                                                <Text strong>@{post.authorUsername}</Text>
                                                <Text type="secondary">{formatDate(post.createdAt)}</Text>
                                            </Space>
                                            <Paragraph style={{ marginBottom: 8 }}>{post.content}</Paragraph>
                                            {post.image && (
                                                <Image
                                                    src={post.image}
                                                    alt="post"
                                                    style={{ borderRadius: 8, maxHeight: 360 }}
                                                />
                                            )}
                                            <Space>
                                                <Button
                                                    size="small"
                                                    type={post.userLiked ? "primary" : "default"}
                                                    icon={post.userLiked ? <HeartFilled /> : <HeartOutlined />}
                                                    loading={likePost.isPending || unlikePost.isPending}
                                                    onClick={() => handleLikeToggle(post)}
                                                >
                                                    {post.likeCount ?? 0}
                                                </Button>
                                                <Button
                                                    size="small"
                                                    type={post.isBookmarked ? "primary" : "default"}
                                                    icon={post.isBookmarked ? <BookFilled /> : <BookOutlined />}
                                                    onClick={() => handleBookmarkToggle(post)}
                                                >
                                                    {post.isBookmarked ? "Salvato" : "Salva"}
                                                </Button>
                                                <Button
                                                    size="small"
                                                    onClick={() => toggleComments(post.id)}
                                                >
                                                    {openComments[post.id] ? "Nascondi commenti" : "Mostra commenti"}
                                                </Button>
                                                <Text type="secondary">
                                                    {post.commentCount ?? 0} commenti
                                                </Text>
                                            </Space>
                                        </Space>

                                        {openComments[post.id] && (
                                            <>
                                                <Divider />

                                                <Space direction="vertical" style={{ width: "100%" }}>
                                                    <Text strong>Commenti</Text>
                                                    <List
                                                        dataSource={post.comments || []}
                                                        locale={{ emptyText: "Nessun commento" }}
                                                        renderItem={(comment) => (
                                                            <List.Item
                                                                key={comment.id}
                                                                actions={
                                                                    comment.authorId === user?.id
                                                                        ? [
                                                                            <Popconfirm
                                                                                key="delete"
                                                                                title="Eliminare commento?"
                                                                                okText="Si"
                                                                                cancelText="No"
                                                                                onConfirm={() =>
                                                                                    handleDeleteComment(post.id, comment.id)
                                                                                }
                                                                            >
                                                                                <Button
                                                                                    size="small"
                                                                                    type="text"
                                                                                    danger
                                                                                    icon={<DeleteOutlined />}
                                                                                />
                                                                            </Popconfirm>,
                                                                        ]
                                                                        : []
                                                                }
                                                            >
                                                                <List.Item.Meta
                                                                    avatar={
                                                                        <Avatar
                                                                            size={28}
                                                                            icon={<UserOutlined />}
                                                                            src={comment.authorImage || null}
                                                                        />
                                                                    }
                                                                    title={
                                                                        <Space split={<Divider type="vertical" />}>
                                                                            <Text strong>@{comment.authorUsername}</Text>
                                                                            <Text type="secondary">
                                                                                {formatDate(comment.createdAt)}
                                                                            </Text>
                                                                        </Space>
                                                                    }
                                                                    description={comment.content}
                                                                />
                                                            </List.Item>
                                                        )}
                                                    />
                                                    <Space>
                                                        <Input
                                                            placeholder="Scrivi un commento"
                                                            value={commentDrafts[post.id] || ""}
                                                            onChange={(e) =>
                                                                setCommentDrafts((prev) => ({
                                                                    ...prev,
                                                                    [post.id]: e.target.value,
                                                                }))
                                                            }
                                                            onPressEnter={() => handleAddComment(post.id)}
                                                        />
                                                        <Button
                                                            type="primary"
                                                            onClick={() => handleAddComment(post.id)}
                                                            loading={addComment.isPending}
                                                        >
                                                            Invia
                                                        </Button>
                                                    </Space>
                                                </Space>
                                            </>
                                        )}
                                    </div>
                                </Space>
                            </Card>
                        </List.Item>
                    )}
                />
            )}
        </>
    );

    const savedContent = (
        <Card title="Post salvati">
            <Input
                allowClear
                placeholder="Cerca post salvati"
                value={savedSearch}
                onChange={(e) => setSavedSearch(e.target.value)}
                style={{ marginBottom: 12, maxWidth: 320 }}
            />
            {!filteredSavedPosts.length ? (
                <Empty description="Nessun post salvato" />
            ) : (
                <List
                    dataSource={filteredSavedPosts}
                    renderItem={(post) => (
                        <List.Item
                            key={post.id}
                            actions={[
                                <a
                                    key="remove"
                                    onClick={() => {
                                        if (!user?.id) return;
                                        removePostBookmark.mutate(
                                            { postId: post.id, userId: user.id },
                                            { onError: () => messageApi.error("Errore rimozione") }
                                        );
                                    }}
                                >
                                    Rimuovi
                                </a>,
                            ]}
                        >
                            <List.Item.Meta
                                title={<Text strong>@{post.authorUsername}</Text>}
                                description={<Text type="secondary">{formatDate(post.createdAt)}</Text>}
                            />
                            <Paragraph style={{ margin: 0 }}>{post.content}</Paragraph>
                        </List.Item>
                    )}
                />
            )}
        </Card>
    );

    return (
        <div style={{ padding: 24 }}>
            {contextHolder}
            <Tabs
                defaultActiveKey="feed"
                items={[
                    { key: "feed", label: "Feed", children: feedContent },
                    { key: "saved", label: "Post salvati", children: savedContent },
                ]}
            />
        </div>
    );
}
