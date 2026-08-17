"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useChatUnread } from "@/lib/hooks/useChat";
import { applyMode, resolveInitialMode, setMode, subscribeToMode } from "@/lib/theme";
import type { PopupState, ThemeMode } from "@/utils/types";
import { Command, Languages, Moon, Palette, Sun, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import CommandPopup from "./CommandPopup";
import LanguagePicker from "./LanguagePicker";
import ProfileDropdown from "./ProfileDropdown";
import ThemeColorPicker from "./ThemeColorPicker";

const defaultHex = "#000000";

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
    const { user, isAdmin } = useAuth();
    const { unreadCount } = useChatUnread();
    const [state, setState] = useState<{
        mode: ThemeMode;
        colorTheme: string;
        customColor: string;
        activePopup: PopupState;
    }>({
        mode: "light",
        colorTheme: "black-white",
        customColor: defaultHex,
        activePopup: null,
    });

    const colorRef = useRef<HTMLDivElement>(null);
    const languageRef = useRef<HTMLDivElement>(null);
    const commandRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    const applyCustom = (color: string, currentMode: ThemeMode) => {
        const root = document.documentElement;
        root.setAttribute("data-theme", "custom");
        const factor = currentMode === "dark" ? 1.3 : 1.0;
        const primaryHex = adjustLightness(color, factor);
        root.style.setProperty("--primary", primaryHex);
        root.style.setProperty("--primary-rgb", hexToRgb(primaryHex));
        root.style.setProperty("--blob1", primaryHex);
        root.style.setProperty("--blob2", adjustLightness(color, 0.7 * factor));
        root.style.setProperty("--blob3", adjustLightness(color, 1.2 * factor));
    };

    const handleThemeChange = (newTheme: string) => {
        const root = document.documentElement;
        if (newTheme === "custom") {
            setState((prev) => ({ ...prev, colorTheme: "custom" }));
            localStorage.setItem("color-theme", "custom");
            applyCustom(state.customColor, state.mode);
        } else {
            setState((prev) => ({ ...prev, colorTheme: newTheme }));
            localStorage.setItem("color-theme", newTheme);
            root.setAttribute("data-theme", newTheme);
            root.style.removeProperty("--primary");
            root.style.removeProperty("--primary-rgb");
            root.style.removeProperty("--blob1");
            root.style.removeProperty("--blob2");
            root.style.removeProperty("--blob3");
        }
        setState((prev) => ({ ...prev, activePopup: null }));
    };

    const handleCustomColorChange = (newColor: string) => {
        setState((prev) => ({ ...prev, customColor: newColor }));
        localStorage.setItem("custom-primary", newColor);
        applyCustom(newColor, state.mode);
    };

    const handleModeToggle = () => {
        const newMode: ThemeMode = state.mode === "light" ? "dark" : "light";
        setState((prev) => ({ ...prev, mode: newMode }));
        setMode(newMode);
    };

    const handleReset = () => {
        handleThemeChange("black-white");
        setState((prev) => ({ ...prev, customColor: defaultHex }));
        localStorage.setItem("custom-primary", defaultHex);
    };

    const togglePopup = (popup: PopupState) => {
        setState((prev) => ({
            ...prev,
            activePopup: prev.activePopup === popup ? null : popup,
        }));
    };

    useEffect(() => {
        const root = document.documentElement;
        const savedColor = localStorage.getItem("color-theme") || "black-white";

        const initialMode = resolveInitialMode();

        setState((prev) => ({
            ...prev,
            mode: initialMode,
            colorTheme: savedColor,
            customColor: savedColor === "custom" ? localStorage.getItem("custom-primary") || defaultHex : defaultHex,
        }));

        setMode(initialMode);

        if (savedColor === "custom") {
            const customColor = localStorage.getItem("custom-primary") || defaultHex;
            applyCustom(customColor, initialMode);
        } else {
            root.setAttribute("data-theme", savedColor);
        }

        // Keep the toggle in step if the mode changes elsewhere (another tab).
        return subscribeToMode((mode) => {
            applyMode(mode);
            setState((prev) => (prev.mode === mode ? prev : { ...prev, mode }));
        });
    }, []);

    useEffect(() => {
        if (state.colorTheme === "custom") {
            applyCustom(state.customColor, state.mode);
        }
    }, [state.mode, state.colorTheme, state.customColor]);

    // Close the open popup on outside click or Escape.
    useEffect(() => {
        const active = state.activePopup;
        if (!active) return;

        const containers: Record<string, React.RefObject<HTMLDivElement | null>> = {
            color: colorRef,
            command: commandRef,
            profile: profileRef,
            language: languageRef,
        };

        const close = () => setState((prev) => ({ ...prev, activePopup: null }));

        const handlePointerDown = (e: MouseEvent | TouchEvent) => {
            const container = containers[active]?.current;
            if (container && !container.contains(e.target as Node)) close();
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") close();
        };

        document.addEventListener("mousedown", handlePointerDown);
        document.addEventListener("touchstart", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handlePointerDown);
            document.removeEventListener("touchstart", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [state.activePopup]);

    const buttonBaseClass =
        "text-foreground cursor-pointer inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium outline-none transition-all focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 hover:text-accent-foreground dark:hover:text-accent-foreground has-[>svg]:px-3 size-9 p-0";

    const hoverGradientClass =
        "hover:bg-gradient-to-b hover:from-primary/20 hover:to-primary/10 dark:hover:from-primary/30 dark:hover:to-primary/20";

    return (
        <div className="flex items-center gap-1.5 sm:gap-2">
            <button
                onClick={handleModeToggle}
                className={`${buttonBaseClass} ${hoverGradientClass}`}
                aria-label="Toggle theme mode"
            >
                {state.mode === "light" ? <Moon className="size-4" /> : <Sun className="size-4" />}
            </button>

            <div className="relative" ref={languageRef}>
                <button
                    onClick={() => togglePopup("language")}
                    className={`${buttonBaseClass} ${hoverGradientClass} ${state.activePopup === "language" ? "bg-primary/10" : ""}`}
                    aria-label="Change language"
                    aria-expanded={state.activePopup === "language"}
                >
                    <Languages className="size-4" />
                </button>
                {state.activePopup === "language" && (
                    <div className="absolute right-0 top-full mt-5 min-w-44 bg-background/95 supports-[backdrop-filter]:bg-background/85 backdrop-blur-xl backdrop-saturate-150 border border-border/70 rounded-xl shadow-xl shadow-black/10 z-50 p-1.5 animate-in fade-in-0 zoom-in-95">
                        <LanguagePicker onSelect={() => setState((prev) => ({ ...prev, activePopup: null }))} />
                    </div>
                )}
            </div>

            <div className="relative" ref={colorRef}>
                <button
                    onClick={() => togglePopup("color")}
                    className={`${buttonBaseClass} ${hoverGradientClass} ${state.activePopup === "color" ? "bg-primary/10" : ""
                        }`}
                    aria-label="Select theme color"
                    aria-expanded={state.activePopup === "color"}
                >
                    <Palette className="size-4" />
                </button>
                {state.activePopup === "color" && (
                    <div className="absolute right-0 top-full mt-5 bg-background/95 supports-[backdrop-filter]:bg-background/85 backdrop-blur-xl backdrop-saturate-150 border border-border/70 rounded-xl shadow-xl shadow-black/10 z-50 animate-in fade-in-0 zoom-in-95">
                        <ThemeColorPicker
                            colorTheme={state.colorTheme}
                            mode={state.mode}
                            customColor={state.customColor}
                            onThemeChange={handleThemeChange}
                            onCustomChange={handleCustomColorChange}
                            onReset={handleReset}
                            onClose={() => setState((prev) => ({ ...prev, activePopup: null }))}
                        />
                    </div>
                )}
            </div>

            <div className="relative" ref={commandRef}>
                <button
                    onClick={() => togglePopup("command")}
                    className={`${buttonBaseClass} ${hoverGradientClass} ${state.activePopup === "command" ? "bg-primary/10" : ""
                        }`}
                    aria-label="Open command menu"
                    aria-expanded={state.activePopup === "command"}
                >
                    <Command className="size-4" />
                </button>
                {state.activePopup === "command" && (
                    <div className="fixed inset-x-0 top-[96px] z-50 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2">
                        <div className="max-w-5xl mx-auto px-4 sm:px-8">
                            <CommandPopup onClose={() => setState((prev) => ({ ...prev, activePopup: null }))} />
                        </div>
                    </div>
                )}
            </div>

            {user && (
                <div className="relative" ref={profileRef}>
                    <button
                        onClick={() => togglePopup("profile")}
                        className={`${buttonBaseClass} ${hoverGradientClass} ${state.activePopup === "profile" ? "bg-primary/10" : ""}`}
                        aria-expanded={state.activePopup === "profile"}
                        aria-label="User profile"
                    >
                        <User className="size-4" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-medium animate-pulse">
                                {unreadCount > 9 ? "9+" : unreadCount}
                            </span>
                        )}
                    </button>

                    {state.activePopup === "profile" && (
                        <div className="absolute right-0 top-full mt-5 bg-background/95 supports-[backdrop-filter]:bg-background/85 backdrop-blur-xl backdrop-saturate-150 border border-border/70 rounded-xl shadow-xl shadow-black/10 z-50 animate-in fade-in-0 zoom-in-95 w-48">
                            <ProfileDropdown onClose={() => setState((prev) => ({ ...prev, activePopup: null }))} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
