"use client";

import { MotionPopup } from "@/components/motion";
import { languages } from "@/data";

interface LanguageDropdownProps {
    onLanguageSelect: (code: string) => void;
}

export default function LanguageDropdown({ onLanguageSelect }: Readonly<LanguageDropdownProps>) {
    return (
        <MotionPopup isOpen={true} className="p-2 min-w-[140px]">
            {languages.map((lang) => (
                <button
                    key={lang.code}
                    onClick={() => onLanguageSelect(lang.code)}
                    className="w-full text-left px-3 py-2 rounded-md text-sm transition-colors hover:bg-muted text-foreground flex items-center gap-2 cursor-pointer"
                >
                    <span className="text-lg">{lang.flag}</span>
                    <span>{lang.name}</span>
                </button>
            ))}
        </MotionPopup>
    );
}