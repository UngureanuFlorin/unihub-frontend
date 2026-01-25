import { useState, useEffect } from "react";
export default function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch {
                localStorage.removeItem("user");
            }
        }

        setLoading(false);
    }, []);

    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
    };

    return { user, loading, logout };
}
