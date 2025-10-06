import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { forwardRef } from "react";

export interface CustomLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
    target?: string;
    rel?: string;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
    variant?: "primary" | "secondary" | "underline" | "button";
}

const CustomLink = forwardRef<HTMLAnchorElement, CustomLinkProps>(
    (
        { href, children, className = "", target = "_self", rel = "", onClick, variant = "underline" },
        ref
    ) => {
        const baseClasses = "relative group inline-block transition-colors focus:outline-none";

        const variantClasses = {
            primary: "text-primary hover:text-primary/80 font-medium",
            secondary: "text-muted-foreground hover:text-foreground",
            underline:
                "text-muted-foreground hover:text-foreground underline decoration-[color-mix(in_srgb,_currentColor_30%,var(--background))] hover:decoration-current",
            button:
                "px-6 py-3 rounded-xl bg-primary/80 dark:bg-primary/90 text-primary-foreground font-medium inline-flex items-center gap-3 hover:bg-primary/90 dark:hover:bg-primary focus:outline-none",
        };

        const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

        return (
            <Link
                ref={ref}
                href={href}
                className={combinedClasses}
                target={target}
                rel={rel}
                onClick={onClick}
            >
                {children}
                <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 transform px-2 py-1 bg-gray-600 text-gray-100 text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible whitespace-nowrap z-50 pointer-events-none dark:bg-gray-200 dark:text-gray-800 max-w-xs">
                    <span className="flex items-center gap-1">
                        {href}
                        <ExternalLink className="size-3" />
                    </span>
                </div>
            </Link>
        );
    }
);

CustomLink.displayName = "CustomLink";

export default CustomLink;