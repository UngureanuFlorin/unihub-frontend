import { Button, Card, DatePicker, Form, Input, InputNumber, Select, Space, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useCreateEvent } from "../queries/events.mutations";
import { getErrorMessage } from "../utils/error.js";
import { useUserProfile } from "../queries/users.queries.js";
import { useCategories } from "../queries/categories.queries.js";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

export default function SubmitEvent() {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const createEventMutation = useCreateEvent();
    const [messageApi, contextHolder] = message.useMessage();
    const currentUserId = (() => {
        try {
            return JSON.parse(localStorage.getItem("user"))?.id ?? null;
        } catch {
            return null;
        }
    })();
    const { data: profile } = useUserProfile(currentUserId);
    const { data: categories = [] } = useCategories();

    const categoryOptions = categories.length
        ? categories.map((c) => ({ value: c.nome, label: c.nome }))
        : [
            { value: "accademico", label: "Accademico" },
            { value: "sport", label: "Sport" },
            { value: "cultura", label: "Cultura" },
            { value: "carriera", label: "Carriera" },
            { value: "volontariato", label: "Volontariato" },
        ];

    const handleSubmit = async (values) => {
        try {
            const username = JSON.parse(localStorage.getItem("user"))?.username;
            if (!username) {
                messageApi.error("Utente non loggato!");
                return;
            }

            const [start, end] = values.datetimeRange;
            const userUniversity = profile?.university || profile?.universita || profile?.universitaNome;

            if (!userUniversity) {
                messageApi.error("Imposta l'universita nel profilo prima di creare un evento.");
                return;
            }

            const eventPayload = {
                titolo: values.title,
                descrizione: values.description,
                luogo: values.place,
                categoria: values.category,
                universita: userUniversity,
                dataInizio: start.toISOString(),
                dataFine: end.toISOString(),
                postiTotali: values.totalSeats,
                deadlineIscrizione: values.deadline.toISOString(),
            };

            await createEventMutation.mutateAsync({ eventPayload, username });

            messageApi.success("Evento creato con successo!");
            form.resetFields();
        } catch (err) {
            messageApi.error(getErrorMessage(err, "Errore durante la creazione"));
        }
    };

    const isSubmitting = createEventMutation.isPending;

    return (
        <div style={{ padding: 24 }}>
            {contextHolder}

            <Space style={{ marginBottom: 16 }}>
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
                    Torna indietro
                </Button>
            </Space>

            <Card
                title="Crea un nuovo evento"
                style={{
                    maxWidth: 700,
                    margin: "0 auto",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    borderRadius: 12,
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{ totalSeats: 100 }}
                >
                    <Form.Item
                        name="title"
                        label="Titolo"
                        rules={[{ required: true, message: "Inserisci un titolo" }]}
                    >
                        <Input placeholder="Titolo dell'evento" maxLength={120} showCount />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Descrizione"
                        rules={[
                            { required: true, message: "Inserisci una descrizione" },
                            { min: 20, max: 2000, message: "Minimo 20 caratteri" },
                        ]}
                    >
                        <TextArea rows={5} placeholder="Descrivi brevemente l'evento..." showCount />
                    </Form.Item>

                    <Form.Item
                        name="place"
                        label="Luogo (fisico o online)"
                        rules={[{ required: true, message: "Specifica il luogo" }]}
                    >
                        <Input placeholder="Esempio: Aula Magna 1 o Link Zoom" />
                    </Form.Item>

                    <Form.Item
                        name="category"
                        label="Categoria"
                        rules={[{ required: true, message: "Seleziona una categoria" }]}
                    >
                        <Select
                            placeholder="Seleziona una categoria"
                            options={categoryOptions}
                        />
                    </Form.Item>

                    <Form.Item label="Universita (dal profilo)">
                        <Input
                            value={profile?.university || profile?.universita || profile?.universitaNome || ""}
                            placeholder="Imposta l'universita nel profilo"
                            disabled
                        />
                    </Form.Item>

                    <Form.Item
                        name="datetimeRange"
                        label="Periodo dell'evento"
                        rules={[{ required: true, message: "Specifica data e ora" }]}
                    >
                        <RangePicker
                            showTime
                            style={{ width: "100%" }}
                            placeholder={["Data inizio", "Data fine"]}
                            format="YYYY-MM-DD HH:mm"
                        />
                    </Form.Item>

                    <Form.Item
                        name="deadline"
                        label="Scadenza iscrizioni"
                        rules={[{ required: true, message: "Specifica la deadline" }]}
                    >
                        <DatePicker
                            showTime
                            style={{ width: "100%" }}
                            format="YYYY-MM-DD HH:mm"
                            placeholder="Deadline iscrizioni"
                        />
                    </Form.Item>

                    <Form.Item
                        name="totalSeats"
                        label="Posti totali disponibili"
                        rules={[{ required: true, message: "Specifica il numero di posti" }]}
                    >
                        <InputNumber min={1} max={500} style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            size="large"
                            loading={isSubmitting}
                        >
                            {isSubmitting ? "Creazione in corso..." : "Crea evento"}
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}
