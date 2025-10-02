import React from "react";
import { ConfigProvider, theme as antdTheme } from "antd";

function ThemeProvider({ children }) {
    return (
        <ConfigProvider
            theme={{
                algorithm: antdTheme.defaultAlgorithm,
                token: {
                    colorPrimary: "#1677ff",
                    borderRadius: 8,
                    fontFamily: "Poppins, sans-serif",
                },
                components: {
                    Button: { controlHeight: 36 },
                    Layout: { headerBg: "#fff" },
                },
            }}
        >
            {children}
        </ConfigProvider>
    );
}

export default ThemeProvider;
