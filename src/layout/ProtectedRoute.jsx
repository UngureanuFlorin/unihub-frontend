import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

export default function ProtectedRoute({ children, allow = [] }) {
    const { user, loading } = useAuth();

    if (loading) return null; // puoi mettere uno spinner qui se vuoi
    if (!user) return <Navigate to="/login" replace />;
    if (allow.length && !allow.includes(user.role)) return <Navigate to="/home" replace />;

    return children;
}
