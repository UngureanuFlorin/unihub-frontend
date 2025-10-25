import React, { useState } from "react";
import {
    Card,
    List,
    Button,
    Input,
    Typography,
    Space,
    Modal,
} from "antd";
import {
    useUniversitaList,
    useDipartimenti,
} from "../queries/universita.queries.js";
import {
    useAddDipartimento,
    useDeleteDipartimento,
} from "../queries/dipartimenti.mutations.js";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined, HomeOutlined } from "@ant-design/icons";

const { Title } = Typography;

export default function UniversitaList() {
    const [selectedUni, setSelectedUni] = useState(null);
    const [newDeptName, setNewDeptName] = useState("");
    const [confirmDelete, setConfirmDelete] = useState(null);

    const navigate = useNavigate();

    const { data: universita, isLoading: loadingUni } = useUniversitaList();
    const { data: dipartimenti, isLoading: loadingDeps } = useDipartimenti(selectedUni?.id);

    const addMutation = useAddDipartimento(selectedUni?.id);
    const deleteMutation = useDeleteDipartimento(selectedUni?.id);

    return (
        <div style={{ padding: 24 }}>
            <Space style={{ marginBottom: 16 }}>
                <Button
                    icon={<HomeOutlined />}
                    onClick={() => navigate("/home")}
                    type="default"
                >
                    Torna alla Home
                </Button>
            </Space>

            <Title level={2}>Università</Title>

            {/* Lista Università */}
            <List
                bordered
                loading={loadingUni}
                dataSource={universita || []}
                renderItem={(u) => (
                    <List.Item
                        style={{
                            cursor: "pointer",
                            background:
                                selectedUni?.id === u.id ? "rgba(22,119,255,0.1)" : "white",
                        }}
                        onClick={() => setSelectedUni(u)}
                    >
                        <List.Item.Meta title={u.nome} />
                    </List.Item>
                )}
            />

            {/* Selezione Università */}
            {selectedUni && (
                <Card
                    title={`Dipartimenti di ${selectedUni.nome}`}
                    style={{ marginTop: 24 }}
                    loading={loadingDeps}
                >
                    {/* Lista dipartimenti */}
                    <List
                        dataSource={dipartimenti || []}
                        renderItem={(d) => (
                            <List.Item
                                actions={[
                                    <Button
                                        danger
                                        onClick={() => setConfirmDelete(d.id)}
                                        loading={deleteMutation.isPending}
                                    >
                                        Elimina
                                    </Button>,
                                ]}
                            >
                                <List.Item.Meta title={d.nome} />
                            </List.Item>
                        )}
                    />

                    {/* Form nuovo dipartimento */}
                    <div style={{ marginTop: 24 }}>
                        <Title level={4}>Aggiungi Dipartimento</Title>
                        <Space direction="vertical" style={{ width: "100%" }}>
                            <Input
                                placeholder="Nome dipartimento"
                                value={newDeptName}
                                onChange={(e) => setNewDeptName(e.target.value)}
                            />
                            <Button
                                type="primary"
                                onClick={() => {
                                    addMutation.mutate({ nome: newDeptName });
                                    setNewDeptName("");
                                }}
                                disabled={!newDeptName}
                                loading={addMutation.isPending}
                            >
                                Aggiungi
                            </Button>
                        </Space>
                    </div>
                </Card>
            )}

            {/* Modale conferma eliminazione */}
            <Modal
                open={!!confirmDelete}
                title="Conferma eliminazione"
                okText="Elimina"
                okType="danger"
                onOk={() => {
                    deleteMutation.mutate(confirmDelete);
                    setConfirmDelete(null);
                }}
                onCancel={() => setConfirmDelete(null)}
            >
                Sei sicuro di voler eliminare questo dipartimento?
            </Modal>
        </div>
    );
}
