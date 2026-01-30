import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import QueryProvider from "./app/providers/QueryProvider.jsx";
import ThemeProvider from "./app/providers/ThemeProvider.jsx";
import "antd/dist/reset.css";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <ThemeProvider>
        <QueryProvider>
            <App />
        </QueryProvider>
    </ThemeProvider>
);
