import { ConfigProvider, theme as antdTheme } from "antd";
import itIT from "antd/locale/it_IT";

export default function ThemeProvider({ children }) {
    return (
        <ConfigProvider
            locale={itIT}
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
