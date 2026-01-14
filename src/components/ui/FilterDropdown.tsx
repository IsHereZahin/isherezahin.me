"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui";
import { Settings2 } from "lucide-react";

export interface FilterOption<T extends string = string> {
    value: T;
    label: string;
}

interface FilterDropdownProps<T extends string = string> {
    options: FilterOption<T>[];
    value: T;
    onChange: (value: T) => void;
    icon?: React.ReactNode;
}

export default function FilterDropdown<T extends string = string>({
    options,
    value,
    onChange,
    icon,
}: Readonly<FilterDropdownProps<T>>) {
    const currentLabel = options.find((o) => o.value === value)?.label || options[0]?.label || "Select";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium cursor-pointer rounded-lg border border-border bg-background text-foreground hover:bg-secondary hover:text-secondary-foreground transition">
                    {icon || <Settings2 className="w-4 h-4" />}
                    {currentLabel}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                {options.map((option) => (
                    <DropdownMenuItem
                        key={option.value}
                        onClick={() => onChange(option.value)}
                        className={`cursor-pointer ${
                            value === option.value
                                ? "bg-secondary text-secondary-foreground"
                                : ""
                        }`}
                    >
                        {option.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
