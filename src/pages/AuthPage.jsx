import { useState } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import AuthTabs from "../components/auth/AuthTabs";
import LoginFields from "../components/auth/LoginFields";
import RegisterFields from "../components/auth/RegisterFields";
import { useAuthLogin } from "../hooks/useAuthLogin";
import { useAuthRegister } from "../hooks/useAuthRegister";
import { AUTH_TABS } from "../constants/auth.constants.js";

function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Errore lettura immagine"));
        reader.readAsDataURL(file);
    });
}

export default function AuthPage() {
    const [activeTab, setActiveTab] = useState(AUTH_TABS.LOGIN);

    const navigate = useNavigate();
    const loginMutation = useAuthLogin();
    const registerMutation = useAuthRegister();

    const [messageApi, contextHolder] = message.useMessage();

    const handleLoginFinish = async (values) => {
        try {
            const res = await loginMutation.mutateAsync(values);

            const user = {
                id: res.id,
                username: res.username,
                role: res.role,
            };

            localStorage.setItem("user", JSON.stringify(user));

            messageApi.success(res.message || "Accesso eseguito!");
            navigate("/home");
        } catch (err) {
            messageApi.error(err?.response?.data?.message || "Errore durante il login");
        }
    };

    const handleRegisterFinish = async (values) => {
        if (values.password !== values.confirm) {
            messageApi.error("Le password non coincidono");
            return;
        }

        try {
            const payload = { ...values };

            const file = payload.profileImage?.[0]?.originFileObj || null;
            if (file) {
                payload.profileImage = await fileToDataUrl(file);
            } else {
                delete payload.profileImage;
            }

            await registerMutation.mutateAsync(payload);

            messageApi.success("Registrazione completata!");
            setActiveTab(AUTH_TABS.LOGIN);
        } catch (err) {
            messageApi.error(err?.response?.data?.message || "Errore nella registrazione");
        }
    };

    const isLogin = activeTab === AUTH_TABS.LOGIN;

    return (
        <>
            {contextHolder}

            <AuthLayout
                title={
                    <span
                        style={{
                            background: "linear-gradient(90deg, #1677ff, #00b96b)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            fontWeight: "bold",
                        }}
                    >
                        UniHub
                    </span>
                }
                subTitle="Eventi & Club universitari"
                logo="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Eo_circle_blue_white_letter-u.svg/2048px-Eo_circle_blue_white_letter-u.svg.png"
                submitter={{
                    searchConfig: { submitText: isLogin ? "Accedi" : "Registrati" },
                    submitButtonProps: { loading: loginMutation.isPending || registerMutation.isPending },
                }}
                onFinish={isLogin ? handleLoginFinish : handleRegisterFinish}
            >
                <AuthTabs activeKey={activeTab} onChange={setActiveTab} />
                {isLogin ? <LoginFields /> : <RegisterFields />}
            </AuthLayout>
        </>
    );
}
