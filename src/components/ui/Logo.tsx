import Link from "next/link";

interface LogoProps {
    href?: string;
    label?: string;
    size?: number;
    colorClass?: string;
    className?: string;
}

export default function Logo({ href = "/", label = "Logo", size = 40, colorClass = "text-primary", className = "" }: Readonly<LogoProps>) {
    return (
        <Link
            href={href}
            className={`flex items-center justify-center gap-1 font-medium ${className}`}
            aria-label={label}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                aria-hidden="true"
                className={`w-[${size}px] h-[${size}px] mt-4 ${colorClass}`}
            >
                <path
                    fillRule="evenodd"
                    d="M4.927 1039.363a1.001 1.001 0 0 0 .102 2h3.984l-4.781 6.402a1 1 0 0 0 .8 1.597h5.98a1 1 0 1 0 0-2H7.028l4.781-6.397a1 1 0 0 0-.8-1.601h-5.98a1 1 0 0 0-.102 0z"
                    fill="currentColor"
                    transform="translate(0 -1036.362)"
                />
            </svg>
            <span className="sr-only">{label}</span>
        </Link>
    );
}
