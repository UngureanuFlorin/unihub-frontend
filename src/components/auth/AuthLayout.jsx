import React from "react";
import { ProConfigProvider, LoginForm } from "@ant-design/pro-components";
import { createIntl } from "@ant-design/pro-provider";
import itIT from "@ant-design/pro-provider/es/locale/it_IT";

const intl = createIntl("it_IT", itIT);

export default function AuthLayout({
                                       title,
                                       subTitle,
                                       logo,
                                       children,
                                       submitter,
                                       onFinish,
                                   }) {
    return (
        <ProConfigProvider hashed={false} intl={intl}>
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
                    title={title}
                    subTitle={subTitle}
                    logo={logo}
                    submitter={submitter}
                    onFinish={onFinish}
                >
                    {children}
                </LoginForm>
            </div>
        </ProConfigProvider>
    );
}
