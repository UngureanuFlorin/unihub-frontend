import React from "react";
import { Tabs } from "antd";

export default function AuthTabs({ activeKey, onChange }) {
    return (
        <Tabs
            centered
            activeKey={activeKey}
            onChange={onChange}
            items={[
                { key: "login", label: "Login" },
                { key: "register", label: "Registrazione" },
            ]}
        />
    );
}
