import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge'; // Even if not using tailwind, useful for class merging, or just clsx. 
// Wait, if not using tailwind, twMerge might not be needed, but it helps if we eventually switch or use utility classes. 
// For pure CSS, just clsx is fine.

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    'btn',
                    `btn-${variant}`,
                    `btn-${size}`,
                    className
                )}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading ? <span className="spinner" /> : children}
            </button>
        );
    }
);
Button.displayName = 'Button';
