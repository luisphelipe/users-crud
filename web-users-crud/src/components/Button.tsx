import clsx from 'clsx';
import { ButtonHTMLAttributes, FC } from 'react';

interface Props {
    small?: boolean;
    loading?: boolean;
}

const Button: FC<ButtonHTMLAttributes<HTMLButtonElement> & Props> = ({
    children,
    className,
    small = false,
    loading,
    ...props
}) => {
    let classes = '';

    if (small) classes += '!w-[140px]';

    return (
        <button
            {...props}
            disabled={props.disabled || loading}
            className={clsx(
                `w-full h-[33px] rounded-sm px-1 py-[6px] bg-orange-400 text-black cursor-pointer`,
                loading && '!bg-gray-400 !cursor-default',
                className,
                classes,
            )}
        >
            {loading ? 'loading...' : children}
        </button>
    );
};

export default Button;
