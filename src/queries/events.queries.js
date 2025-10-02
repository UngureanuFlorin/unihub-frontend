import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { fetchEventById, fetchEvents } from "../api/events";
import { qk } from "./keys";

export function useEvent(id) {
    return useQuery({
        queryKey: qk.event(id),
        queryFn: () => fetchEventById(id),
        enabled: !!id,
    });
}

export function useInfiniteEvents(params) {
    return useInfiniteQuery({
        queryKey: qk.events(params),
        queryFn: ({ pageParam = 1 }) => fetchEvents({ ...params, page: pageParam }),
        getNextPageParam: (lastPage) => (lastPage?.hasNextPage ? lastPage.page + 1 : undefined),
    });
}
