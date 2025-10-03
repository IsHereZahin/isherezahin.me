import { SeeMoreProps } from "@/utils/types";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function SeeMore({ href, text = "See more", className = "" }: Readonly<SeeMoreProps>) {
    return (
        <Link
            href={href}
            className={`self-center flex items-center gap-2 hover:text-foreground transition-colors text-muted-foreground ${className}`}
            data-fade="3"
        >
            <span className="leading-none">{text}</span>

            <div
                className="flex items-center justify-center size-6 rounded-[10px] isolate backdrop-blur-sm relative"
                style={{
                    "--borderWidth": "1",
                    "--background":
                        "linear-gradient(to bottom right, rgba(23, 23, 23, 70%) 0%, #525252 62%, rgba(23, 23, 23, 70%) 100%)",
                    border: "1px solid transparent",
                }}
            >
                <ChevronRight className="size-[70%]" strokeWidth={1.3} />
            </div>
        </Link>
    );
}