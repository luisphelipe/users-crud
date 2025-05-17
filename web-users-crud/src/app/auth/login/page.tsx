'use client';

import { useForm } from 'react-hook-form';
import { Input, Button } from '@/components';
import Link from 'next/link';
import axios from 'axios';
import { AUTH_LOGIN } from '../../../config/api';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { authActions } from '../../../store';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

type FormData = {
    email: string;
    password: string;
};

export default function Login() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(AUTH_LOGIN, data);
            dispatch(authActions.login(response?.data));
            Cookies.set('access_token', response?.data?.access_token, { path: '/' });
            router.push('/users');
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const message = err.response?.data?.message || 'Unknown error';
                setError(message);
            }
        }

        setLoading(false);
    };

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                <div className="w-[400px] h-[550px] bg-gray-700 bg-opacity-50 rounded-lg flex flex-col items-center justify-center p-5">
                    <div className="text-5xl font-black mb-12">USERS CRUD</div>

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
                        <div className="flex w-full items-center justify-end mb-12">
                            <Link
                                href="/auth/forgot-password"
                                className="text-gray-400 border-b border-dashed border-gray-400 cursor-pointer"
                            >
                                Forgot your password?
                            </Link>
                        </div>
                        <Button className="mb-6" type="submit" loading={loading}>
                            Log In
                        </Button>
                    </form>
                    <div className="flex w-full items-center justify-between">
                        <div>Don&apos;t have an account?</div>
                        <Link href="/auth/signup" className="cursor-pointer">
                            <Button className="!bg-inherit !w-[140px] text-white border-1 border-gray-500">
                                Create
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
