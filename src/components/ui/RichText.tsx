import ReferralLink from "@/components/ui/ReferralLink";
import Link from "next/link";
import type { ReactNode } from "react";

interface RichTextProps {
    /** Text with inline markdown. */
    text: string;
    className?: string;
}

// Order matters: links first so their label isn't parsed as emphasis.
const TOKEN = /(\[[^\]]+\]\([^)]+\))|(\*\*[^*]+\*\*)|(\*[^*]+\*)|(`[^`]+`)/g;

function renderLink(label: string, href: string, key: number): ReactNode {
    // In-site routes and anchors navigate normally; everything else is treated
    // as an outbound link (new tab + referral tooltip).
    if (href.startsWith("/") || href.startsWith("#")) {
        return (
            <Link key={key} href={href} className="text-primary hover:underline">
                {label}
            </Link>
        );
    }

    const url = /^[a-z]+:/i.test(href) ? href : `https://${href}`;

    return (
        <ReferralLink
            key={key}
            href={url}
            className="font-medium underline decoration-secondary-foreground/20 text-foreground hover:decoration-primary transition-colors"
        >
            {label}
        </ReferralLink>
    );
}

/**
 * Renders a single line/paragraph of inline markdown as React elements:
 * `**bold**`, `*italic*`, `` `code` `` and `[label](url)`.
 *
 * Used by the static pages so copy can live as plain strings in `src/data`
 * without any `dangerouslySetInnerHTML`.
 */
export default function RichText({ text, className }: Readonly<RichTextProps>) {
    const parts = text.split(TOKEN).filter((part) => part !== undefined && part !== "");

    return (
        <span className={className}>
            {parts.map((part, index) => {
                const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
                if (link) return renderLink(link[1], link[2], index);

                if (part.startsWith("**") && part.endsWith("**")) {
                    return (
                        <strong key={index} className="text-foreground">
                            {part.slice(2, -2)}
                        </strong>
                    );
                }

                if (part.startsWith("*") && part.endsWith("*")) {
                    return <em key={index}>{part.slice(1, -1)}</em>;
                }

                if (part.startsWith("`") && part.endsWith("`")) {
                    return (
                        <code key={index} className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
                            {part.slice(1, -1)}
                        </code>
                    );
                }

                return <span key={index}>{part}</span>;
            })}
        </span>
    );
}
