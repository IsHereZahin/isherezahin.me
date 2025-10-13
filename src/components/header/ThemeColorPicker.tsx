"use client";

import MotionPopup from "@/components/motion/MotionPopup";
import { availableThemes } from "@/data";
import { ThemeMode } from "@/utils/types";
import { Plus, RefreshCw, X } from "lucide-react";
import { useState } from "react";

interface ThemeColorPickerProps {
    colorTheme: string;
    mode: ThemeMode;
    customColor: string;
    onThemeChange: (theme: string) => void;
    onCustomChange: (color: string) => void;
    onReset: () => void;
    onClose: () => void;
}

export default function ThemeColorPicker({
    colorTheme,
    mode,
    customColor,
    onThemeChange,
    onCustomChange,
    onReset,
    onClose,
}: Readonly<ThemeColorPickerProps>) {
    const [showCustomPicker, setShowCustomPicker] = useState(false);

    const handleApplyCustom = () => {
        setShowCustomPicker(false);
        onThemeChange("custom");
    };

    return (
        <MotionPopup isOpen={true} className="p-3 min-w-[220px]">
            <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Primary Color
                </span>
                <button
                    onClick={onClose}
                    className="text-foreground cursor-pointer hover:text-primary transition-colors p-1 -m-1"
                    aria-label="Close color picker"
                >
                    <X className="size-4" />
                </button>
            </div>

            <div className="flex items-center gap-1 mb-2">
                {availableThemes.map((theme) => {
                    const bgColor = mode === "light" ? theme.lightPrimary : theme.darkPrimary;
                    const isSelected = colorTheme === theme.name;

                    return (
                        <button
                            key={theme.name}
                            onClick={() => onThemeChange(theme.name)}
                            className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer hover:scale-110 ${isSelected
                                ? "border-primary ring-2 ring-primary/50 scale-110"
                                : "border-border hover:border-primary/50"
                                }`}
                            style={{ backgroundColor: bgColor }}
                            aria-label={`Theme: ${theme.name}`}
                            title={theme.name}
                        >
                            {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                        </button>
                    );
                })}

                <button
                    onClick={() => setShowCustomPicker(!showCustomPicker)}
                    className="w-7 h-7 rounded-full border-2 border-dashed border-border hover:border-primary transition-all flex items-center justify-center hover:scale-110"
                    aria-label="Custom color"
                    title="Custom color"
                >
                    <Plus className="w-3.5 h-3.5 text-foreground" />
                </button>
            </div>

            {showCustomPicker && (
                <div className="mt-3 p-3 bg-muted rounded-lg flex items-center gap-2 animate-in fade-in-50 slide-in-from-top-1">
                    <span className="text-xs font-medium text-muted-foreground">Custom:</span>
                    <input
                        type="color"
                        value={customColor}
                        onChange={(e) => onCustomChange(e.target.value)}
                        className="w-8 h-8 rounded-md border border-border cursor-pointer hover:border-primary transition-colors"
                        aria-label="Color picker input"
                    />
                    <button
                        onClick={handleApplyCustom}
                        className="text-xs font-medium text-primary hover:text-primary/80 transition-colors ml-auto px-2 py-1 hover:bg-muted rounded cursor-pointer"
                    >
                        Apply
                    </button>
                </div>
            )}

            <button
                onClick={onReset}
                className="w-full mt-3 p-2 hover:bg-muted cursor-pointer rounded-md transition-colors flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
                title="Reset to default"
            >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset
            </button>
        </MotionPopup>
    );
}