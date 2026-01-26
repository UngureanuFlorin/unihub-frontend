import React from "react";
import { Card, Form, Input, DatePicker, InputNumber, Button, message } from "antd";
import { useCreateEvent } from "../queries/events.mutations";
import { getErrorMessage } from "../utils/error.js";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

function SubmitEvent() {
    const [form] = Form.useForm();
    const createEventMutation = useCreateEvent();
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = async (values) => {
        try {
            const username = JSON.parse(localStorage.getItem("user"))?.username;
            if (!username) {
                messageApi.error("Utente non loggato!");
                return;
            }

            const [start, end] = values.datetimeRange;

            const eventPayload = {
                titolo: values.title,
                descrizione: values.description,
                luogo: values.place,
                dataInizio: start.toISOString(),
                dataFine: end.toISOString(),
                postiTotali: values.totalSeats,
                deadlineIscrizione: values.deadline.toISOString(),
            };

            // passa username come query param
            await createEventMutation.mutateAsync({ eventPayload, username });

            messageApi.success("✅ Evento creato con successo!");
            form.resetFields();
        } catch (err) {
            messageApi.error(getErrorMessage(err, "Errore durante la creazione"));
        }
    };


    return (
        <div style={{ padding: 24 }}>
            {contextHolder}
            <Card
                title="🎉 Crea un nuovo evento"
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
                    onFinish={onFinish}
                    initialValues={{
                        totalSeats: 100,
                    }}
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
                            loading={createEventMutation.isPending}
                        >
                            {createEventMutation.isPending ? "Creazione in corso..." : "Crea evento"}
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}

export default SubmitEvent;
