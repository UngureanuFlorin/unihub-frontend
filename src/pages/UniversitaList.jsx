import { useState } from "react";
import { Button, Card, Input, List, Modal, Space, Typography } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDipartimenti, useUniversitaList } from "../queries/universita.queries.js";
import { useAddDipartimento, useDeleteDipartimento } from "../queries/dipartimenti.mutations.js";

const { Title } = Typography;

export default function UniversitaList() {
    const navigate = useNavigate();

    const [selectedUniversity, setSelectedUniversity] = useState(null);
    const [newDepartmentName, setNewDepartmentName] = useState("");
    const [departmentToDeleteId, setDepartmentToDeleteId] = useState(null);

    const { data: universities, isLoading: isUniversitiesLoading } = useUniversitaList();
    const { data: departments, isLoading: isDepartmentsLoading } = useDipartimenti(
        selectedUniversity?.id
    );

    const addDepartmentMutation = useAddDipartimento(selectedUniversity?.id);
    const deleteDepartmentMutation = useDeleteDipartimento(selectedUniversity?.id);

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
            <Space style={{ marginBottom: 16 }}>
                <Button icon={<HomeOutlined />} onClick={() => navigate("/home")} type="default">
                    Torna alla Home
                </Button>
            </Space>

            <Title level={2}>Università</Title>

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
                        >
                            <List.Item.Meta title={university.nome} />
                        </List.Item>
                    );
                }}
            />

            {selectedUniversity && (
                <Card
                    title={`Dipartimenti di ${selectedUniversity.nome}`}
                    style={{ marginTop: 24 }}
                    loading={isDepartmentsLoading}
                >
                    <List
                        dataSource={departments || []}
                        renderItem={(department) => (
                            <List.Item
                                actions={[
                                    <Button
                                        key="delete"
                                        danger
                                        onClick={() => setDepartmentToDeleteId(department.id)}
                                        loading={deleteDepartmentMutation.isPending}
                                    >
                                        Elimina
                                    </Button>,
                                ]}
                            >
                                <List.Item.Meta title={department.nome} />
                            </List.Item>
                        )}
                    />

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
                </Card>
            )}

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
