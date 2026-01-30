import { ProForm, ProFormText } from "@ant-design/pro-components";
import { message } from "antd";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "../api/apiClient.js";

export default function ForgotPassword() {
    const navigate = useNavigate();

    const resetPasswordMutation = useMutation({
        mutationKey: ["resetPassword"],
        mutationFn: async (payload) => {
            const res = await api.post("/auth/reset-password", payload);
            return res.data;
        },
        onSuccess: (data) => {
            message.success(data);
            navigate("/login", { replace: true });
        },
        onError: (err) => {
            message.error(err.response?.data || "Errore durante il reset della password");
        },
    });

    const handleSubmit = async (values) => {
        await resetPasswordMutation.mutateAsync({
            username: values.username,
            newPassword: values.newPassword,
        });
    };

    return (
        <div
            style={{
                maxWidth: 400,
                margin: "50px auto",
                padding: 16,
                background: "#fff",
                borderRadius: 8,
            }}
        >
            <h2 style={{ textAlign: "center", marginBottom: 24 }}>Reset Password</h2>

            <ProForm
                onFinish={handleSubmit}
                submitter={{ searchConfig: { submitText: "Aggiorna Password" } }}
            >
                <ProFormText
                    name="username"
                    label="Username"
                    placeholder="Inserisci il tuo username"
                    rules={[{ required: true, message: "Lo username è obbligatorio" }]}
                />

                <ProFormText.Password
                    name="newPassword"
                    label="Nuova Password"
                    placeholder="Inserisci la nuova password"
                    rules={[{ required: true, message: "La password è obbligatoria" }]}
                />
            </ProForm>
        </div>
    );
}
