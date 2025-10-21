import React from "react";
import { Navigate } from "react-router-dom";
import { Spin } from "antd";
import useAuth from "../hooks/useAuth.js";

export default function PublicRoute({ children }) {
    const { user, loading } = useAuth();

    // 🔄 Spinner durante il caricamento
    if (loading) {
        return (
            <div
                style={{
                    height: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Spin size="large" tip="Caricamento..." />
            </div>
        );
    }

    // 👤 Già loggato → manda alla home
    if (user) return <Navigate to="/home" replace />;

    // ✅ Non loggato → mostra la pagina (es: login)
    return children;
}
