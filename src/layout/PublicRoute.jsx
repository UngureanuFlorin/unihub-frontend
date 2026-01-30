import { Navigate } from "react-router-dom";
import { Spin } from "antd";
import useAuth from "../hooks/useAuth.js";

export default function PublicRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Spin size="large" tip="Caricamento..." />
            </div>
        );
    }

    if (user) return <Navigate to="/home" replace />;

    return children;
}
