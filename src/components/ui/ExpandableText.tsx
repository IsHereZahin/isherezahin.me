"use client";

import { truncateText } from "@/utils";
import { useState } from "react";

interface ExpandableTextProps {
    text: string;
    limit?: number;
}

export default function ExpandableText({ text, limit = 180 }: Readonly<ExpandableTextProps>) {
    const [expanded, setExpanded] = useState(false);
    const isLong = text.length > limit;

    const toggle = () => setExpanded(!expanded);

    return (
        <div className="text-secondary-foreground leading-relaxed mb-6">
            <p className="inline">
                {expanded || !isLong ? text : truncateText(text, limit)}
            </p>
            {isLong && (
                <button
                    onClick={toggle}
                    className="ml-1 text-primary/80 hover:text-primary cursor-pointer text-sm sm:text-base font-medium inline"
                >
                    {expanded ? "See less" : "See more"}
                </button>
            )}
        </div>
    );
}