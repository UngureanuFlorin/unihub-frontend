import React from "react";
import { ProFormText, ProFormCheckbox } from "@ant-design/pro-components";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import {Link} from "react-router-dom";

export default function LoginFields() {
    return (
        <>
            <ProFormText
                name="username"
                fieldProps={{ size: "large", prefix: <UserOutlined className="prefixIcon" /> }}
                placeholder="Username"
                rules={[{ required: true, message: "Inserisci lo username!" }]}
            />
            <ProFormText.Password
                name="password"
                fieldProps={{ size: "large", prefix: <LockOutlined className="prefixIcon" /> }}
                placeholder="Password"
                rules={[{ required: true, message: "Inserisci la password!" }]}
            />
            <div style={{ marginBlockEnd: 24 }}>
                <ProFormCheckbox noStyle name="autoLogin">Ricordami</ProFormCheckbox>
                <a style={{ float: "right" }}>
                    <Link
                        to="/forgot-password"
                        style={{ float: "right" }}
                    >
                        Password dimenticata?
                    </Link>
                </a>
            </div>
        </>
    );
}
