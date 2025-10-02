import React, { useState } from "react";
import {
    LockOutlined,
    UserOutlined,
    MailOutlined,
    IdcardOutlined,
} from "@ant-design/icons";
import {
    LoginForm,
    ProConfigProvider,
    ProFormCheckbox,
    ProFormText,
} from "@ant-design/pro-components";
import { Space, Tabs, message, theme } from "antd";

function AuthPage() {
    const { token } = theme.useToken();
    const [activeTab, setActiveTab] = useState("login"); // 'login' | 'register'

    // TODO: collega queste funzioni alle tue API reali
    const handleLoginFinish = async (values) => {
        // values: { username, password, autoLogin? }
        message.success("Accesso eseguito!");
        // redirect dove preferisci
    };

    const handleRegisterFinish = async (values) => {
        // values: { name, surname, email, cf?, password, confirm }
        if (values.password !== values.confirm) {
            message.error("Le password non coincidono");
            return;
        }
        message.success("Registrazione completata!");
        setActiveTab("login");
    };

    return (
        <ProConfigProvider hashed={false}>
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "linear-gradient(90deg, #e3ffe7 0%, #d9e7ff 100%)",
                    padding: 24,
                }}
            >
                <LoginForm
                    logo="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Eo_circle_blue_white_letter-u.svg/2048px-Eo_circle_blue_white_letter-u.svg.png"
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
                    onFinish={activeTab === "login" ? handleLoginFinish : handleRegisterFinish}
                    submitter={{
                        searchConfig: {
                            submitText: activeTab === "login" ? "Accedi" : "Registrati",
                        },
                    }}
                >
                    <Tabs
                        centered
                        activeKey={activeTab}
                        onChange={(k) => setActiveTab(k)}
                        items={[
                            { key: "login", label: "Login" },
                            { key: "register", label: "Registrazione" },
                        ]}
                    />

                    {activeTab === "login" && (
                        <>
                            <ProFormText
                                name="username"
                                fieldProps={{
                                    size: "large",
                                    prefix: <UserOutlined className="prefixIcon" />,
                                }}
                                placeholder="Username"
                                rules={[{ required: true, message: "Inserisci lo username!" }]}
                            />
                            <ProFormText.Password
                                name="password"
                                fieldProps={{
                                    size: "large",
                                    prefix: <LockOutlined className="prefixIcon" />,
                                }}
                                placeholder="Password"
                                rules={[{ required: true, message: "Inserisci la password!" }]}
                            />
                            <div style={{ marginBlockEnd: 24 }}>
                                <ProFormCheckbox noStyle name="autoLogin">
                                    Ricordami
                                </ProFormCheckbox>
                                <a style={{ float: "right" }}>Password dimenticata?</a>
                            </div>
                        </>
                    )}

                    {activeTab === "register" && (
                        <>
                            <ProFormText
                                name="name"
                                fieldProps={{
                                    size: "large",
                                    prefix: <UserOutlined className="prefixIcon" />,
                                }}
                                placeholder="Nome"
                                rules={[{ required: true, message: "Inserisci il nome!" }]}
                            />
                            <ProFormText
                                name="surname"
                                fieldProps={{
                                    size: "large",
                                    prefix: <UserOutlined className="prefixIcon" />,
                                }}
                                placeholder="Cognome"
                                rules={[{ required: true, message: "Inserisci il cognome!" }]}
                            />
                            <ProFormText
                                name="email"
                                fieldProps={{
                                    size: "large",
                                    prefix: <MailOutlined className="prefixIcon" />,
                                }}
                                placeholder="Email"
                                rules={[
                                    { required: true, message: "Inserisci la email!" },
                                    { type: "email", message: "Email non valida!" },
                                ]}
                            />
                            {/* opzionale: Codice Fiscale */}
                            <ProFormText
                                name="cf"
                                fieldProps={{
                                    size: "large",
                                    prefix: <IdcardOutlined className="prefixIcon" />,
                                }}
                                placeholder="Codice Fiscale (opzionale)"
                            />
                            <ProFormText.Password
                                name="password"
                                fieldProps={{
                                    size: "large",
                                    prefix: <LockOutlined className="prefixIcon" />,
                                }}
                                placeholder="Password"
                                rules={[{ required: true, message: "Inserisci la password!" }]}
                            />
                            <ProFormText.Password
                                name="confirm"
                                fieldProps={{
                                    size: "large",
                                    prefix: <LockOutlined className="prefixIcon" />,
                                }}
                                placeholder="Conferma password"
                                rules={[{ required: true, message: "Conferma la password!" }]}
                            />
                        </>
                    )}
                </LoginForm>
            </div>
        </ProConfigProvider>
    );
}

export default AuthPage;
