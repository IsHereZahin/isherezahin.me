"use client";

import { format, isToday, isYesterday } from "date-fns";

interface DateDividerProps {
    date: string;
}

export default function DateDivider({ date }: DateDividerProps) {
    const dateObj = new Date(date);

    let label: string;
    if (isToday(dateObj)) {
        label = "Today";
    } else if (isYesterday(dateObj)) {
        label = "Yesterday";
    } else {
        label = format(dateObj, "MMMM d, yyyy");
    }

    return (
        <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground font-medium px-2">
                {label}
            </span>
            <div className="flex-1 h-px bg-border" />
        </div>
    );
}
