// src/lib/theme.ts
//
// Single source of truth for the site's dark/light preference.
//
// The public site and the admin dashboard share this one setting: toggling in
// either place paints the other. Both surfaces render off the same `dark` class
// on <html>, so there is only ever one stored value.

import type { ThemeMode } from "@/utils/types";

export const THEME_STORAGE_KEY = "mode";

/** Legacy key: the admin panel used to keep its own, separate preference. */
const LEGACY_ADMIN_KEY = "admin-theme";

/** Dispatched on `window` when the mode changes inside this tab. */
export const THEME_CHANGE_EVENT = "theme-mode-change";

function isMode(value: unknown): value is ThemeMode {
    return value === "light" || value === "dark";
}

export function getStoredMode(): ThemeMode | null {
    if (typeof window === "undefined") return null;

    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (isMode(saved)) return saved;

    // One-time migration for admins who had only the old admin-only preference.
    const legacy = window.localStorage.getItem(LEGACY_ADMIN_KEY);
    if (isMode(legacy)) {
        window.localStorage.setItem(THEME_STORAGE_KEY, legacy);
        window.localStorage.removeItem(LEGACY_ADMIN_KEY);
        return legacy;
    }

    return null;
}

export function getSystemMode(): ThemeMode {
    if (typeof window === "undefined") return "light";
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** Stored preference, falling back to the operating system setting. */
export function resolveInitialMode(): ThemeMode {
    return getStoredMode() ?? getSystemMode();
}

/** Paints a mode without persisting it. */
export function applyMode(mode: ThemeMode): void {
    document.documentElement.classList.toggle("dark", mode === "dark");
}

/**
 * Applies, persists and broadcasts a mode. Use this for every toggle so the
 * other surface (and any other open tab) picks the change up.
 */
export function setMode(mode: ThemeMode): void {
    applyMode(mode);
    window.localStorage.setItem(THEME_STORAGE_KEY, mode);
    window.dispatchEvent(new CustomEvent<ThemeMode>(THEME_CHANGE_EVENT, { detail: mode }));
}

/**
 * Listen for mode changes — both from this tab (custom event) and from other
 * tabs (storage event). Returns an unsubscribe function.
 */
export function subscribeToMode(onChange: (mode: ThemeMode) => void): () => void {
    const handleLocal = (event: Event) => {
        const { detail } = event as CustomEvent<ThemeMode>;
        if (isMode(detail)) onChange(detail);
    };

    const handleStorage = (event: StorageEvent) => {
        if (event.key !== THEME_STORAGE_KEY || !isMode(event.newValue)) return;
        applyMode(event.newValue);
        onChange(event.newValue);
    };

    window.addEventListener(THEME_CHANGE_EVENT, handleLocal);
    window.addEventListener("storage", handleStorage);

    return () => {
        window.removeEventListener(THEME_CHANGE_EVENT, handleLocal);
        window.removeEventListener("storage", handleStorage);
    };
}
