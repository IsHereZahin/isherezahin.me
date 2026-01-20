"use client";

import { truncateText } from "@/utils";
import { parseMarkdown } from "@/lib/markdown";
import { useState } from "react";

interface ExpandableTextProps {
    text: string;
    limit?: number;
    markdown?: boolean;
    className?: string;
}

export default function ExpandableText({ text, limit = 180, markdown = false, className }: Readonly<ExpandableTextProps>) {
    const [expanded, setExpanded] = useState(false);
    const isLong = text.length > limit;

    const toggle = () => setExpanded(!expanded);

    const displayText = expanded || !isLong ? text : truncateText(text, limit);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains("expandable-btn")) {
            toggle();
        }
    };

    const getContentWithButton = () => {
        let html = parseMarkdown(displayText);
        if (!isLong) return html;

        const buttonText = expanded ? "See less" : "See more";
        const buttonHtml = `<button class="expandable-btn text-primary/80 hover:text-primary cursor-pointer text-sm sm:text-base font-medium">${buttonText}</button>`;

        // Find the last </p> tag and insert button before it
        const lastPClose = html.lastIndexOf("</p>");
        if (lastPClose !== -1) {
            return html.slice(0, lastPClose) + " " + buttonHtml + html.slice(lastPClose);
        }
        return html + " " + buttonHtml;
    };

    if (markdown) {
        return (
            <div
                className={`${className ?? "text-muted-foreground group-hover/card:text-foreground/80 transition-colors leading-relaxed mb-6"} prose prose-sm max-w-none`}
                dangerouslySetInnerHTML={{ __html: getContentWithButton() }}
                onClick={handleClick}
            />
        );
    }

    return (
        <div className={className ?? "text-muted-foreground group-hover/card:text-foreground/80 transition-colors leading-relaxed mb-6"}>
            <span>{displayText}</span>
            {isLong && (
                <button
                    onClick={toggle}
                    className="ml-1 text-primary/80 hover:text-primary cursor-pointer text-sm sm:text-base font-medium"
                >
                    {expanded ? "See less" : "See more"}
                </button>
            )}
        </div>
    );
}