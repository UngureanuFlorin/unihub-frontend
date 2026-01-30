import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

export default function ProtectedRoute({ children, allow = [] }) {
    const { user, loading } = useAuth();

    if (loading) return null;
    if (!user) return <Navigate to="/login" replace />;
    if (allow.length && !allow.includes(user.role)) {
        return <Navigate to="/home" replace />;
    }

    return children;
}
