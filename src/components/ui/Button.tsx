import Link from 'next/link';
import { ReactNode } from 'react';

interface ButtonProps {
    href?: string;
    text: string;
    icon?: ReactNode;
    onClick?: () => void;
    className?: string;
}

export default function Button({ href, text, icon, onClick, className = "cursor-pointer" }: Readonly<ButtonProps>) {
    const baseClasses =
        "inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-background text-foreground text-sm sm:text-base font-medium shadow-feature-card border border-foreground/5 transition-all duration-200 hover:translate-y-0.5 hover:border-foreground/20";

    const content = (
        <>
            <span>{text}</span>
            {icon && (
                <div className="size-5 sm:size-6 rounded-lg bg-background/80 flex items-center justify-center shadow-inner shadow-foreground/20">
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
