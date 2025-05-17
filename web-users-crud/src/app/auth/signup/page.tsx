'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Input, Button } from '@/components';
import Link from 'next/link';
import axios from 'axios';
import { AUTH_SIGNUP } from '../../../config/api';
import { useState } from 'react';
import { authActions } from '../../../store';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const schema = yup.object({
    email: yup.string().email('Invalid email').required('Email is required'),
    name: yup.string().min(3, 'At least 3 characters').required('Name is required'),
    password: yup.string().min(6, 'At least 6 characters').required('Password is required'),
});

type FormData = yup.InferType<typeof schema>;

export default function Signup() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(AUTH_SIGNUP, data);
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
                    {/* <div className="text-5xl font-black mb-8">USERS CRUD</div> */}
                    <div className="w-full text-xl mb-4 font-bold">Crate an Account</div>
                    <div className="w-full text-md mb-4 ">
                        Create an account to download, save user as favorites, and more
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
                        <Input
                            placeholder="Password"
                            className="mb-4"
                            {...register('password')}
                            error={errors.password}
                            type="password"
                        />
                        <Input
                            placeholder="Name"
                            className="mb-12"
                            {...register('name')}
                            error={errors.name}
                        />

                        <Button className="mb-6" type="submit" loading={loading}>
                            Create Account
                        </Button>
                    </form>
                    <div className="flex w-full items-center justify-between">
                        <div>Already have an account?</div>
                        <Link href="/auth/login" className="cursor-pointer">
                            <Button className="!bg-inherit !w-[140px] text-white border-1 border-gray-500">
                                Log In
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
