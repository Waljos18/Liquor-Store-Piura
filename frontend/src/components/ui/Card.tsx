import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
    return twMerge(clsx(inputs));
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const Card = ({ className, children, ...props }: CardProps) => {
    return (
        <div className={cn('card', className)} {...props}>
            {children}
        </div>
    );
};

export const CardHeader = ({ className, children, ...props }: CardProps) => (
    <div className={cn('card-header', className)} {...props}>{children}</div>
);

export const CardTitle = ({ className, children, ...props }: CardProps) => (
    <h3 className={cn('card-title', className)} {...props}>{children}</h3>
);

export const CardContent = ({ className, children, ...props }: CardProps) => (
    <div className={cn('card-content', className)} {...props}>{children}</div>
);
