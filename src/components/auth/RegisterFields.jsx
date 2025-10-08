import React from "react";
import { ProFormText } from "@ant-design/pro-components";
import { LockOutlined, UserOutlined, MailOutlined, IdcardOutlined } from "@ant-design/icons";

export default function RegisterFields() {
    return (
        <>
            <ProFormText
                name="name"
                fieldProps={{ size: "large", prefix: <UserOutlined className="prefixIcon" /> }}
                placeholder="Nome"
                rules={[{ required: true, message: "Inserisci il nome!" }]}
            />
            <ProFormText
                name="surname"
                fieldProps={{ size: "large", prefix: <UserOutlined className="prefixIcon" /> }}
                placeholder="Cognome"
                rules={[{ required: true, message: "Inserisci il cognome!" }]}
            />
            <ProFormText
                name="email"
                fieldProps={{ size: "large", prefix: <MailOutlined className="prefixIcon" /> }}
                placeholder="Email"
                rules={[
                    { required: true, message: "Inserisci la email!" },
                    { type: "email", message: "Email non valida!" },
                ]}
            />
            <ProFormText
                name="cf"
                fieldProps={{ size: "large", prefix: <IdcardOutlined className="prefixIcon" /> }}
                placeholder="Codice Fiscale (opzionale)"
            />
            <ProFormText.Password
                name="password"
                fieldProps={{ size: "large", prefix: <LockOutlined className="prefixIcon" /> }}
                placeholder="Password"
                rules={[{ required: true, message: "Inserisci la password!" }]}
            />
            <ProFormText.Password
                name="confirm"
                fieldProps={{ size: "large", prefix: <LockOutlined className="prefixIcon" /> }}
                placeholder="Conferma password"
                rules={[{ required: true, message: "Conferma la password!" }]}
            />
        </>
    );
}
