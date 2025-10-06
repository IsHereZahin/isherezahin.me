import { generateProfessionalUnderline } from "@/utils";
import Link from "next/link";

export interface StylishLinkProps {
    slug: string;
    label?: string;
    color?: string;
    seed?: string;
}

export default function StylishLink({ slug, label = "View Project", color = "#22c55e", seed = label }: Readonly<StylishLinkProps>) {
    const pathD = generateProfessionalUnderline(seed);

    return (
        <Link
            href={slug}
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 relative group mt-2"
        >
            <span className="font-base font-medium text-foreground/90 py-1">
                {label}
            </span>

            <div className="absolute left-0 bottom-0 h-[8px] w-0 group-hover:w-full transition-all duration-[500ms] overflow-hidden">
                <svg
                    className="rough-annotation h-full duration-[2000ms]"
                    viewBox="0 0 100 10"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ width: "100%", minWidth: "100px", color }}
                >
                    <path
                        d={pathD}
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="transparent"
                    />
                </svg>
            </div>
        </Link>
    )
}