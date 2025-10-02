import { useMemo } from "react";

function useAuth() {
    // TODO: collega al tuo backend; per ora utente non loggato
    const loading = false;
    const user = null; // es: { id: 'u1', role: 'moderator', name: 'Alice' }
    return useMemo(() => ({ user, loading }), [user, loading]);
}

export default useAuth;
