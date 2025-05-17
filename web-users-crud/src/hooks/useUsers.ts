import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchUsers } from '@/lib/fetchUsers';

export type User = { id: string; email: string; name: string };

export const useUsers = (initialData?: any) => {
    return useInfiniteQuery({
        initialPageParam: 1,
        queryKey: ['users'],
        queryFn: async ({ pageParam }) => fetchUsers(pageParam),
        getNextPageParam: (lastPage) => lastPage.meta.next,
        initialData: initialData
            ? {
                  pages: [initialData],
                  pageParams: [1],
              }
            : undefined,
    });
};
