"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

export interface MonthOption {
    value: string;
    label: string;
}

export default function MonthDropdown({
    label,
    options,
    selected,
    onSelect,
}: {
    label: string;
    options: MonthOption[];
    selected: string;
    onSelect: (value: string) => void;
}) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setOpen((o) => !o)}
                aria-haspopup="listbox"
                aria-expanded={open}
                className="flex items-center gap-1 text-[13px] text-white/70 transition-colors hover:text-white"
            >
                {label}
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                    <div
                        role="listbox"
                        className="chat-scrollbar absolute right-0 top-full z-50 mt-2 max-h-64 w-40 overflow-y-auto rounded-xl border border-white/10 bg-[#1c1c22] p-1.5 shadow-2xl"
                    >
                        {options.map((opt) => {
                            const active = opt.value === selected;
                            return (
                                <button
                                    key={opt.value}
                                    role="option"
                                    aria-selected={active}
                                    onClick={() => {
                                        onSelect(opt.value);
                                        setOpen(false);
                                    }}
                                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[13px] transition-colors ${active
                                        ? "bg-[var(--s-card)]/10 font-semibold text-[#F4C63D]"
                                        : "text-white/70 hover:bg-[var(--s-card)]/[0.06] hover:text-white"
                                        }`}
                                >
                                    {opt.label}
                                    {active && <span className="ml-2 h-1.5 w-1.5 rounded-full bg-[#F4C63D]" />}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}
