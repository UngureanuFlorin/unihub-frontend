import { useState } from "react";
import { Button, Card, Input, List, Modal, Popconfirm, Space, Tabs, Typography, message } from "antd";
import { ApartmentOutlined, HomeOutlined, TeamOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDipartimenti, useUniversitaList } from "../queries/universita.queries.js";
import { useAddDipartimento, useDeleteDipartimento } from "../queries/dipartimenti.mutations.js";
import { useCreateUniversita, useDeleteUniversita } from "../queries/universita.mutations.js";
import useAuth from "../hooks/useAuth.js";

const { Title } = Typography;

export default function UniversitaList() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const isAdmin = user?.role === "ADMIN";
    const [messageApi, contextHolder] = message.useMessage();

    const [selectedUniversity, setSelectedUniversity] = useState(null);
    const [newDepartmentName, setNewDepartmentName] = useState("");
    const [departmentToDeleteId, setDepartmentToDeleteId] = useState(null);
    const [newUniversityName, setNewUniversityName] = useState("");

    const { data: universities, isLoading: isUniversitiesLoading } = useUniversitaList();
    const { data: departments, isLoading: isDepartmentsLoading } = useDipartimenti(
        selectedUniversity?.id
    );

    const addDepartmentMutation = useAddDipartimento(selectedUniversity?.id);
    const deleteDepartmentMutation = useDeleteDipartimento(selectedUniversity?.id);
    const createUniversitaMutation = useCreateUniversita();
    const deleteUniversitaMutation = useDeleteUniversita();

    const handleAddDepartment = () => {
        addDepartmentMutation.mutate({ nome: newDepartmentName });
        setNewDepartmentName("");
    };

    const handleConfirmDelete = () => {
        deleteDepartmentMutation.mutate(departmentToDeleteId);
        setDepartmentToDeleteId(null);
    };

    return (
        <div style={{ padding: 24 }}>
            {contextHolder}
            <Space style={{ marginBottom: 16 }}>
                <Button icon={<HomeOutlined />} onClick={() => navigate("/home")} type="default">
                    Torna alla Home
                </Button>
            </Space>

            <Title level={2}>Università</Title>

            <Tabs
                defaultActiveKey="universita"
                items={[
                    {
                        key: "universita",
                        label: (
                            <Space>
                                <ApartmentOutlined />
                                Atenei
                            </Space>
                        ),
                        children: (
                            <>
                                {isAdmin && (
                                    <Card style={{ marginBottom: 16 }}>
                                        <Space direction="vertical" style={{ width: "100%" }}>
                                            <Title level={4} style={{ margin: 0 }}>
                                                Aggiungi universita
                                            </Title>
                                            <Space>
                                                <Input
                                                    placeholder="Nome universita"
                                                    value={newUniversityName}
                                                    onChange={(e) => setNewUniversityName(e.target.value)}
                                                />
                                                <Button
                                                    type="primary"
                                                    loading={createUniversitaMutation.isPending}
                                                    onClick={async () => {
                                                        try {
                                                            await createUniversitaMutation.mutateAsync(
                                                                newUniversityName
                                                            );
                                                            setNewUniversityName("");
                                                            messageApi.success("Universita aggiunta");
                                                        } catch (err) {
                                                            messageApi.error(
                                                                String(err?.response?.data || "Errore aggiunta universita")
                                                            );
                                                        }
                                                    }}
                                                >
                                                    Aggiungi
                                                </Button>
                                            </Space>
                                        </Space>
                                    </Card>
                                )}

                                <List
                                    bordered
                                    loading={isUniversitiesLoading}
                                    dataSource={universities || []}
                                    renderItem={(university) => {
                                        const isSelected = selectedUniversity?.id === university.id;

                                        return (
                                            <List.Item
                                                style={{
                                                    cursor: "pointer",
                                                    background: isSelected ? "rgba(22,119,255,0.1)" : "white",
                                                }}
                                                onClick={() => setSelectedUniversity(university)}
                                                actions={
                                                    isAdmin
                                                        ? [
                                                            <Popconfirm
                                                                key="delete"
                                                                title="Eliminare questa universita?"
                                                                okText="Si"
                                                                cancelText="No"
                                                                onConfirm={async () => {
                                                                    try {
                                                                        await deleteUniversitaMutation.mutateAsync(
                                                                            university.id
                                                                        );
                                                                        if (selectedUniversity?.id === university.id) {
                                                                            setSelectedUniversity(null);
                                                                        }
                                                                        messageApi.success("Universita eliminata");
                                                                    } catch (err) {
                                                                        messageApi.error(
                                                                            String(
                                                                                err?.response?.data ||
                                                                                    "Errore eliminazione universita"
                                                                            )
                                                                        );
                                                                    }
                                                                }}
                                                            >
                                                                <Button
                                                                    size="small"
                                                                    danger
                                                                    loading={deleteUniversitaMutation.isPending}
                                                                >
                                                                    Elimina
                                                                </Button>
                                                            </Popconfirm>,
                                                        ]
                                                        : undefined
                                                }
                                            >
                                                <List.Item.Meta title={university.nome} />
                                            </List.Item>
                                        );
                                    }}
                                />
                            </>
                        ),
                    },
                    {
                        key: "dipartimenti",
                        label: (
                            <Space>
                                <TeamOutlined />
                                Dipartimenti
                            </Space>
                        ),
                        children: selectedUniversity ? (
                            <Card
                                title={`Dipartimenti di ${selectedUniversity.nome}`}
                                loading={isDepartmentsLoading}
                            >
                                <List
                                    dataSource={departments || []}
                                    renderItem={(department) => (
                                        <List.Item
                                            actions={
                                                isAdmin
                                                    ? [
                                                        <Button
                                                            key="delete"
                                                            danger
                                                            onClick={() => setDepartmentToDeleteId(department.id)}
                                                            loading={deleteDepartmentMutation.isPending}
                                                        >
                                                            Elimina
                                                        </Button>,
                                                    ]
                                                    : undefined
                                            }
                                        >
                                            <List.Item.Meta title={department.nome} />
                                        </List.Item>
                                    )}
                                />

                                {isAdmin && (
                                    <div style={{ marginTop: 24 }}>
                                        <Title level={4}>Aggiungi Dipartimento</Title>

                                        <Space direction="vertical" style={{ width: "100%" }}>
                                            <Input
                                                placeholder="Nome dipartimento"
                                                value={newDepartmentName}
                                                onChange={(e) => setNewDepartmentName(e.target.value)}
                                            />

                                            <Button
                                                type="primary"
                                                onClick={handleAddDepartment}
                                                disabled={!newDepartmentName}
                                                loading={addDepartmentMutation.isPending}
                                            >
                                                Aggiungi
                                            </Button>
                                        </Space>
                                    </div>
                                )}
                            </Card>
                        ) : (
                            <Card>
                                Seleziona un'universita dalla tab Atenei per vedere i dipartimenti.
                            </Card>
                        ),
                    },
                ]}
            />

            <Modal
                open={Boolean(departmentToDeleteId)}
                title="Conferma eliminazione"
                okText="Elimina"
                okType="danger"
                onOk={handleConfirmDelete}
                onCancel={() => setDepartmentToDeleteId(null)}
            >
                Sei sicuro di voler eliminare questo dipartimento?
            </Modal>
        </div>
    );
}
