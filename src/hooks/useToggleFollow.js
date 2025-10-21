import { useState } from "react";

/**
 * Hook mock per follow/unfollow senza backend.
 * Sostituibile in futuro con React Query.
 */
export default function useToggleFollow(initial = false) {
    const [isFollowing, setIsFollowing] = useState(initial);
    const [loading, setLoading] = useState(false);

    const toggleFollow = async () => {
        setLoading(true);
        // Simula ritardo rete
        await new Promise((r) => setTimeout(r, 400));
        setIsFollowing((v) => !v);
        setLoading(false);
    };

    return { isFollowing, toggleFollow, loading };
}
