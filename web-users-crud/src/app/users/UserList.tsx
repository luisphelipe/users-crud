'use client';

import { User, useUsers } from '@/hooks/useUsers';
import { useEffect, useRef, FC } from 'react';
import { Button } from '@/components';
import { InfiniteData } from '@tanstack/react-query';
import Link from 'next/link';

interface UserProps {
    user: User;
}

const ClientUserList = ({ initialData }: { initialData: any }) => {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useUsers(initialData);

    const loadMoreRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        });

        if (loadMoreRef.current) observer.observe(loadMoreRef.current);

        return () => {
            if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
        };
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    return (
        <div className="grid grid-rows-[20px_1fr_20px] justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-16 font-[family-name:var(--font-geist-sans)]">
            <main className="w-full flex flex-col gap-[32px] row-start-2 items-center sm:items-start max-w-[1140px] mx-auto">
                <div className="w-full flex flex-col gap-[32px] px-1">
                    <div className="w-full flex justify-between items-end">
                        <div className="text-7xl font-black">USERS CRUD</div>
                        <Link className="w-[200px]" href="/users/create">
                            <Button className="max-w-[200px]">Create user</Button>
                        </Link>
                    </div>
                </div>
                <div className="flex flex-wrap w-full max-w-[1140px] mx-auto">
                    <UserTable data={data} />

                    <div ref={loadMoreRef} className="h-px w-px" />
                    {isFetchingNextPage && <p>Loading more...</p>}
                </div>
            </main>
        </div>
    );
};

const UserTable: FC<{ data: InfiniteData<any, unknown> }> = ({ data }) => {
    return (
        <div className="w-full overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-300">
                <thead>
                    <tr>
                        <th className="px-4 py-2 text-left border-b">ID</th>
                        <th className="px-4 py-2 text-left border-b">Email</th>
                        <th className="px-4 py-2 text-left border-b">Name</th>
                        <th className="px-4 py-2 text-left border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.pages.map((page) =>
                        page?.data?.map((user: User) => <UserRow key={user.id} user={user} />),
                    )}
                </tbody>
            </table>
        </div>
    );
};

const UserRow: FC<UserProps> = ({ user }) => {
    return (
        <tr key={user.id}>
            <td className="px-4 py-2 border-b">{user.id}</td>
            <td className="px-4 py-2 border-b">{user.email}</td>
            <td className="px-4 py-2 border-b">{user.name}</td>
            <td className="px-4 py-2 border-b">
                <div className="flex select-none">
                    <Link href={`/users/update/${user.id}`} className="w-[100px]">
                        <Button className="max-w-[100px] opacity-50 hover:opacity-100">
                            Update
                        </Button>
                    </Link>
                </div>
            </td>
        </tr>
    );
};

export default ClientUserList;
