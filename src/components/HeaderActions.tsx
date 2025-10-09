"use client";

import { availableThemes, languages } from "@/data";
import { Command, Languages, Moon, Palette, Plus, RefreshCw, Sun, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import CommandPopup from "./CommandPopup";

const defaultHex = "#14B8A6";

function hexToRgb(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return "0,0,0";
    return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`;
}

function adjustLightness(hex: string, factor: number): string {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;
    r = Math.min(1, Math.max(0, r * factor));
    g = Math.min(1, Math.max(0, g * factor));
    b = Math.min(1, Math.max(0, b * factor));
    r = Math.round(r * 255);
    g = Math.round(g * 255);
    b = Math.round(b * 255);
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

export default function HeaderActions() {
    const [mode, setMode] = useState<"light" | "dark">("light");
    const [colorTheme, setColorTheme] = useState<string>("teal");
    const [customColor, setCustomColor] = useState<string>(defaultHex);
    const [isColorOpen, setIsColorOpen] = useState(false);
    const [showCustomPicker, setShowCustomPicker] = useState(false);
    const [isLanguageOpen, setIsLanguageOpen] = useState(false);
    const [isCommandOpen, setIsCommandOpen] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);
    const languageDropdownRef = useRef<HTMLDivElement>(null);

    const applyCustom = (color: string, currentMode: "light" | "dark") => {
        const root = document.documentElement;
        root.setAttribute("data-theme", "custom");
        const factor = currentMode === "dark" ? 1.3 : 1.0;
        const primaryHex = adjustLightness(color, factor);
        root.style.setProperty("--primary", primaryHex);
        const rgb = hexToRgb(primaryHex);
        root.style.setProperty("--primary-rgb", rgb);
        root.style.setProperty("--blob1", primaryHex);
        const blob2Hex = adjustLightness(color, 0.7 * factor);
        root.style.setProperty("--blob2", blob2Hex);
        const blob3Hex = adjustLightness(color, 1.2 * factor);
        root.style.setProperty("--blob3", blob3Hex);
    };

    const changeColorTheme = (newTheme: string) => {
        const root = document.documentElement;
        if (newTheme === "custom") {
            setColorTheme("custom");
            localStorage.setItem("color-theme", "custom");
            applyCustom(customColor, mode);
        } else {
            setColorTheme(newTheme);
            localStorage.setItem("color-theme", newTheme);
            root.setAttribute("data-theme", newTheme);
            // Remove custom style properties
            root.style.removeProperty("--primary");
            root.style.removeProperty("--primary-rgb");
            root.style.removeProperty("--blob1");
            root.style.removeProperty("--blob2");
            root.style.removeProperty("--blob3");
        }
        setIsColorOpen(false);
        setShowCustomPicker(false);
    };

    const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newColor = e.target.value;
        setCustomColor(newColor);
        localStorage.setItem("custom-primary", newColor);
        applyCustom(newColor, mode);
    };

    const toggleMode = () => {
        const root = document.documentElement;
        const newMode = mode === "light" ? "dark" : "light";
        setMode(newMode);
        localStorage.setItem("mode", newMode);
        root.classList.toggle("dark", newMode === "dark");
    };

    const toggleLanguage = () => {
        if (isLanguageOpen) {
            setIsLanguageOpen(false);
        } else {
            setIsColorOpen(false);
            setIsCommandOpen(false);
            setIsLanguageOpen(true);
        }
    };

    const handleLanguageSelect = (code: string) => {
        // Handle language change logic here
        setIsLanguageOpen(false);
        console.log(`Selected language: ${code}`);
    };

    const resetToDefault = () => {
        changeColorTheme("teal");
        setCustomColor(defaultHex);
        localStorage.setItem("custom-primary", defaultHex);
    };

    const toggleCommand = () => {
        if (isCommandOpen) {
            setIsCommandOpen(false);
        } else {
            setIsColorOpen(false);
            setIsLanguageOpen(false);
            setIsCommandOpen(true);
        }
    };

    const toggleColor = () => {
        if (isColorOpen) {
            setIsColorOpen(false);
            setShowCustomPicker(false);
        } else {
            setIsLanguageOpen(false);
            setIsCommandOpen(false);
            setIsColorOpen(true);
        }
    };

    useEffect(() => {
        const root = document.documentElement;
        const savedMode = localStorage.getItem("mode") as "light" | "dark" | null;
        const savedColor = localStorage.getItem("color-theme") || "teal";

        if (savedMode) {
            setMode(savedMode);
            root.classList.toggle("dark", savedMode === "dark");
        } else {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            const defaultMode = prefersDark ? "dark" : "light";
            setMode(defaultMode);
            root.classList.toggle("dark", defaultMode === "dark");
            localStorage.setItem("mode", defaultMode);
        }

        if (savedColor === "custom") {
            const savedCustom = localStorage.getItem("custom-primary") || defaultHex;
            setCustomColor(savedCustom);
            setColorTheme("custom");
            applyCustom(savedCustom, savedMode || mode);
        } else {
            setColorTheme(savedColor);
            root.setAttribute("data-theme", savedColor);
        }
    }, [mode]);

    useEffect(() => {
        if (colorTheme === "custom") {
            applyCustom(customColor, mode);
        }
    }, [mode, colorTheme, customColor]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                setIsColorOpen(false);
                setShowCustomPicker(false);
            }
        };

        if (isColorOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isColorOpen]);

    useEffect(() => {
        const handleClickOutsideLanguage = (event: MouseEvent) => {
            if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
                setIsLanguageOpen(false);
            }
        };

        if (isLanguageOpen) {
            document.addEventListener("mousedown", handleClickOutsideLanguage);
        } else {
            document.removeEventListener("mousedown", handleClickOutsideLanguage);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutsideLanguage);
        };
    }, [isLanguageOpen]);

    const buttonBaseClass = "text-foreground cursor-pointer inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium outline-none transition-all focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 hover:text-accent-foreground dark:hover:text-accent-foreground has-[>svg]:px-3 size-9 p-0";

    const hoverGradientClass = "hover:bg-gradient-to-b hover:from-primary/20 hover:to-primary/10 dark:hover:from-primary/30 dark:hover:to-primary/20";

    const colorPopupContent = (
        <div className="p-3">
            <div className="flex justify-between items-center mb-2">
                <div className="text-xs text-muted-foreground">Primary Color</div>
                <button
                    onClick={() => setIsColorOpen(false)}
                    className="text-foreground cursor-pointer hover:text-primary"
                >
                    <X className="size-4" />
                </button>
            </div>
            <div className="flex items-center gap-1 mb-2">
                {availableThemes.map((theme) => {
                    const bgColor = mode === "light" ? theme.lightPrimary : theme.darkPrimary;
                    return (
                        <button
                            key={theme.name}
                            onClick={() => changeColorTheme(theme.name)}
                            className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer ${colorTheme === theme.name
                                ? "border-primary ring-2 ring-primary/50 scale-110"
                                : "border-border hover:border-primary/50 hover:scale-105"
                                }`}
                            style={{ backgroundColor: bgColor }}
                        >
                            {colorTheme === theme.name && <div className="w-3 h-3 bg-white rounded-full" />}
                        </button>
                    );
                })}
                <button
                    onClick={() => setShowCustomPicker(!showCustomPicker)}
                    className="w-6 h-6 rounded-full border-2 border-dashed border-border hover:border-primary flex items-center justify-center"
                    title="Custom color"
                >
                    <Plus className="w-3 h-3 text-foreground" />
                </button>
            </div>
            {showCustomPicker && (
                <div className="mt-2 p-2 bg-muted rounded flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Custom:</span>
                    <input
                        type="color"
                        value={customColor}
                        onChange={handleCustomChange}
                        className="w-8 h-8 rounded border"
                    />
                    <button
                        onClick={() => {
                            setShowCustomPicker(false);
                            changeColorTheme("custom");
                        }}
                        className="text-xs hover:text-foreground transition-colors"
                    >
                        Apply
                    </button>
                </div>
            )}
            <button
                onClick={resetToDefault}
                className="w-full mt-2 p-1 hover:bg-muted cursor-pointer rounded transition-colors flex items-center justify-center gap-1 text-sm"
                title="Reset to default"
            >
                <RefreshCw className="w-3 h-3" />
                Reset
            </button>
        </div>
    );

    return (
        <div className="flex items-center gap-2">
            {/* Mode Toggle Button */}
            <button
                onClick={toggleMode}
                className={`${buttonBaseClass} ${hoverGradientClass}`}
                aria-label="Toggle theme mode"
            >
                {mode === "light" ? <Moon className="size-4" /> : <Sun className="size-4" />}
            </button>

            {/* Color Theme Button */}
            <div className="relative" ref={popupRef}>
                <button
                    onClick={toggleColor}
                    className={`${buttonBaseClass} ${hoverGradientClass}`}
                    aria-label="Select theme color"
                >
                    <Palette className="size-4" />
                </button>
                {isColorOpen && (
                    <div className="absolute right-0 top-full mt-2 bg-background border border-border rounded-lg shadow-lg min-w-[200px] z-50">
                        {colorPopupContent}
                    </div>
                )}
            </div>

            {/* Languages Dropdown */}
            <div className="relative" ref={languageDropdownRef}>
                <button
                    onClick={toggleLanguage}
                    className={`${buttonBaseClass} ${hoverGradientClass}`}
                    aria-label="Change language"
                >
                    <Languages className="size-4" />
                </button>
                {isLanguageOpen && (
                    <div className="absolute right-0 top-full mt-2 bg-background border border-border rounded-lg shadow-lg p-2 min-w-[120px] z-50">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageSelect(lang.code)}
                                className="w-full text-left px-3 py-2 rounded-md text-sm transition-colors hover:bg-muted text-foreground flex items-center gap-2"
                            >
                                <span>{lang.flag}</span>
                                <span>{lang.name}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Command Button */}
            <button
                onClick={toggleCommand}
                className={`${buttonBaseClass} ${hoverGradientClass}`}
                aria-label="Open command menu"
            >
                <Command className="size-4" />
            </button>

            {isCommandOpen && (
                <div className="fixed inset-x-0 top-[84px] z-[60] animate-in fade-in-0 zoom-in-95 slide-in-from-top-2">
                    <div className="max-w-5xl mx-auto px-4 sm:px-8">
                        <CommandPopup />
                    </div>
                </div>
            )}
        </div>
    );
}