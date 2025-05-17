'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Input, Button } from '@/components';
import Link from 'next/link';
import axios from 'axios';
import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { getAuthToken } from '@/store';

const getSchema = (isUpdate?: boolean) => {
    return yup.object({
        email: yup.string().email('Invalid email').required('Email is required'),
        name: yup.string().min(3, 'At least 3 characters').required('Name is required'),
        password: yup.string().when([], {
            is: () => !isUpdate,
            then: (schema) =>
                schema.min(6, 'At least 6 characters').required('Password is required'),
            otherwise: (schema) => schema.notRequired(),
        }),
    });
};

type FormData = {
    email: string;
    name: string;
    password?: string;
};

interface Props {
    initialData?: Omit<FormData, 'password'>;
    submitUrl: string;
    isUpdate?: boolean;
}

const ClientUserForm: FC<Props> = ({ initialData, submitUrl, isUpdate }) => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const access_token = useSelector(getAuthToken);

    const router = useRouter();

    const schema = getSchema(isUpdate);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        if (initialData?.email) {
            reset(initialData);
        }
    }, [initialData]);

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        setError('');

        try {
            const request = isUpdate ? axios.put : axios.post;

            await request(submitUrl, data);

            router.push('/users');
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const message = err.response?.data?.message || 'Unknown error';
                setError(message);
            }
        }

        setLoading(false);
    };

    const deleteUser = async (e: any) => {
        e.preventDefault();

        const confirmed = window.confirm('Are you sure you want to delete this user?');

        if (!confirmed) return;

        try {
            await axios.delete(submitUrl, {
                headers: { Authorization: `Bearer ${access_token}` },
            });

            router.push('/users');
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const message = err.response?.data?.message || 'Unknown error';
                setError(message);
            }
        }
    };

    return (
        <div className="grid grid-rows-[20px_1fr_20px] justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-16 font-[family-name:var(--font-geist-sans)]">
            <main className="w-full flex flex-col gap-[32px] row-start-2 items-center sm:items-start max-w-[1140px] mx-auto">
                <div className="w-full flex flex-col gap-[32px] bg-gray-700 rounded-lg py-8 px-4">
                    <div className="w-full text-xl mb-4 font-bold">Create user</div>

                    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                        {error && <p className="text-red-500 text-lg mb-4">{error}</p>}
                        <Input
                            placeholder="Email"
                            className="mb-4"
                            {...register('email')}
                            error={errors.email}
                            type="email"
                        />
                        <Input
                            placeholder="Password"
                            className="mb-4"
                            {...register('password')}
                            error={errors.password}
                            type="password"
                        />
                        <Input
                            placeholder="Name"
                            className="mb-4"
                            {...register('name')}
                            error={errors.name}
                        />

                        <div className="mt-8 mb-6 flex items-center justify-between">
                            {isUpdate && (
                                <Button
                                    className="max-w-[200px] bg-red-600 text-white"
                                    type="button"
                                    onClick={deleteUser}
                                >
                                    Delete
                                </Button>
                            )}
                            <div className="flex items-center justify-end flex-1">
                                <Link href="/users">Cancel</Link>
                                <Button
                                    className="max-w-[200px] ml-8"
                                    type="submit"
                                    loading={loading}
                                >
                                    Save
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default ClientUserForm;
