import Link from 'next/link';
import { ReactNode } from 'react';

interface ButtonProps {
    href?: string;
    text: string;
    icon?: ReactNode;
    onClick?: () => void;
    className?: string;
}

export default function Button({ href, text, icon, onClick, className = "" }: Readonly<ButtonProps>) {
    const baseClasses =
        "inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl backdrop-blur-sm border border-foreground/10 hover:border-foreground/20 text-foreground text-xs sm:text-sm font-medium transition-all duration-200 hover:translate-y-0.5 cursor-pointer";

    const content = (
        <>
            <span>{text}</span>
            {icon && (
                <div className="size-5 sm:size-6 rounded-md sm:rounded-lg flex items-center justify-center bg-foreground/5 backdrop-blur-sm border border-foreground/10">
                    {icon}
                </div>
            )}
        </>
    );

    if (href) {
        return (
            <Link href={href} className={`${baseClasses} ${className}`}>
                {content}
            </Link>
        );
    }

    return (
        <button onClick={onClick} className={`${baseClasses} ${className}`}>
            {content}
        </button>
    );
}
