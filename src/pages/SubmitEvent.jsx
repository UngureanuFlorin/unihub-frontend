import React from "react";
import { Card, Form, Input, DatePicker, Select, Upload, Button } from "antd";

const { TextArea } = Input;

function SubmitEvent() {
    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log("Valori evento (solo debug, nessun salvataggio):", values);
    };

    return (
        <div style={{ padding: 24 }}>
            <Card title="Proponi un evento">
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item name="title" label="Titolo" rules={[{ required: true }]}>
                        <Input maxLength={120} showCount />
                    </Form.Item>

                    <Form.Item name="summary" label="Sommario" rules={[{ required: true }]}>
                        <Input maxLength={160} showCount />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Descrizione"
                        rules={[{ required: true, min: 20, max: 2000 }]}
                    >
                        <TextArea rows={6} showCount />
                    </Form.Item>

                    <Form.Item name="datetime" label="Data/Ora" rules={[{ required: true }]}>
                        <DatePicker showTime style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item name="place" label="Luogo (fisico o online)" rules={[{ required: true }]}>
                        <Input placeholder="Indirizzo o link meeting" />
                    </Form.Item>

                    <Form.Item name="link" label="Link evento (opzionale)">
                        <Input placeholder="https://…" />
                    </Form.Item>

                    <Form.Item name="category" label="Categoria" rules={[{ required: true }]}>
                        <Select
                            placeholder="Seleziona categoria"
                            options={[
                                { value: "accademico", label: "Accademico" },
                                { value: "sport", label: "Sport" },
                                { value: "cultura", label: "Cultura" },
                                { value: "carriera", label: "Carriera" },
                                { value: "volontariato", label: "Volontariato" },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item name="university" label="Ateneo" rules={[{ required: true }]}>
                        <Select
                            options={[
                                { value: "unimi", label: "UniMi" },
                                { value: "polimi", label: "PoliMi" },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item name="faculty" label="Facoltà (opzionale)">
                        <Select
                            allowClear
                            options={[
                                { value: "ingegneria", label: "Ingegneria" },
                                { value: "economia", label: "Economia" },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item name="cover" label="Copertina (opzionale)">
                        <Upload beforeUpload={() => false} listType="picture-card">
                            Carica
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Invia (solo demo)
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}

export default SubmitEvent;
