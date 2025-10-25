import React, { useState } from "react";
import AuthLayout from "../components/auth/AuthLayout";
import AuthTabs from "../components/auth/AuthTabs";
import LoginFields from "../components/auth/LoginFields";
import RegisterFields from "../components/auth/RegisterFields";
import { useAuthLogin } from "../hooks/useAuthLogin";
import { useAuthRegister } from "../hooks/useAuthRegister";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { AUTH_TABS } from "../constants/auth.constants.js";

export default function AuthPage() {
    const [activeTab, setActiveTab] = useState(AUTH_TABS.LOGIN);
    const navigate = useNavigate();
    const loginMutation = useAuthLogin();
    const registerMutation = useAuthRegister();

    const [messageApi, contextHolder] = message.useMessage();

    const handleLoginFinish = async (values) => {
        try {
            const res = await loginMutation.mutateAsync(values);

            const userData = {
                id: res.id,
                username: res.username,
                role: res.role,
            };
            localStorage.setItem("user", JSON.stringify(userData));

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
            await registerMutation.mutateAsync(values);
            messageApi.success("Registrazione completata!");
            setActiveTab(AUTH_TABS.LOGIN);
        } catch (err) {
            messageApi.error(err?.response?.data?.message || "Errore nella registrazione");
        }
    };

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
                    searchConfig: { submitText: activeTab === AUTH_TABS.LOGIN ? "Accedi" : "Registrati" },
                    submitButtonProps: { loading: loginMutation.isPending || registerMutation.isPending },
                }}
                onFinish={activeTab === AUTH_TABS.LOGIN ? handleLoginFinish : handleRegisterFinish}
            >
                <AuthTabs activeKey={activeTab} onChange={setActiveTab} />
                {activeTab === AUTH_TABS.LOGIN ? <LoginFields /> : <RegisterFields />}
            </AuthLayout>
        </>
    );
}
