import { ChevronRight } from "lucide-react";
import Link from "next/link";

export interface SeeMoreProps {
    href: string;
    text?: string;
    className?: string;
}

export default function SeeMore({ href, text = "See more", className = "" }: Readonly<SeeMoreProps>) {
    return (
        <Link
            href={href}
            className={`self-center flex items-center gap-1 hover:text-foreground transform duration-300 transition-colors text-secondary-foreground text-sm sm:text-base ${className}`}
            data-fade="3"
        >
            <span className="leading-none">{text}</span>

            <div
                className="flex items-center mb-[-2px] justify-center size-5 sm:size-6 rounded-[10px] isolate backdrop-blur-sm relative"
            >
                <ChevronRight className="size-[70%]" strokeWidth={1.3} />
            </div>
        </Link>
    );
}