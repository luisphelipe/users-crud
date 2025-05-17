'use client';

import { useForm } from 'react-hook-form';
import { Input, Button } from '@/components';
import Link from 'next/link';
import axios from 'axios';
import { AUTH_FORGOT_PASSWORD } from '../../../config/api';
import { useState } from 'react';

type FormData = {
    email: string;
};

export default function ForgotPassword() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        setError('');

        try {
            await axios.post(AUTH_FORGOT_PASSWORD, data);
            setSubmitted(true);
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
                <div className="w-[400px] h-[350px] bg-gray-700 bg-opacity-50 rounded-lg flex flex-col items-center justify-center p-5">
                    {submitted ? (
                        <div className="w-full text-center text-xl mb-6 font-bol">
                            Check your email inbox
                        </div>
                    ) : (
                        <>
                            <div className="w-full text-xl mb-6 font-bold">
                                Restore access to your account
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                                {error && <p className="text-red-500 text-lg mb-4">{error}</p>}
                                <Input
                                    placeholder="Email"
                                    className="mb-4"
                                    {...register('email')}
                                    error={errors.email}
                                    type="email"
                                />

                                <Button className="mb-6" type="submit" loading={loading}>
                                    Restore access
                                </Button>
                            </form>
                            <div className="flex w-full items-center justify-between">
                                <div>Remember your password?</div>
                                <Link href="/auth/login" className="cursor-pointer">
                                    <Button className="!bg-inherit !w-[140px] text-white border-1 border-gray-500">
                                        Log In
                                    </Button>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
