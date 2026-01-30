import { useEffect, useState } from "react";

const STORAGE_KEY = "user";

function readStoredUser() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        localStorage.removeItem(STORAGE_KEY);
        return null;
    }
}

export default function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setUser(readStoredUser());
        setLoading(false);
    }, []);

    const logout = () => {
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
    };

    return { user, loading, logout };
}
