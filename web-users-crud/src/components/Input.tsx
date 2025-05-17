import clsx from 'clsx';
import { FC, InputHTMLAttributes } from 'react';

interface Props {
    label?: string;
    inputClassName?: string;
    error?: { message?: string };
}

const Input: FC<InputHTMLAttributes<HTMLInputElement> & Props> = ({
    className,
    label,
    inputClassName,
    error,
    ...props
}) => {
    return (
        <div className={clsx('w-full', className)}>
            {label && <p className="font-medium mb-2 text-base">{label}</p>}
            <input
                {...props}
                className={clsx(
                    'border border-gray-500 rounded-sm px-1 py-[6px] w-full outline-none',
                    inputClassName,
                )}
            ></input>
            {error?.message && <p className="text-sm text-red-500 mt-2">{error.message}</p>}
        </div>
    );
};

export default Input;
