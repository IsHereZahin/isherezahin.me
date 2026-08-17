// src/i18n/config.ts
//
// Locale registry for the static pages.
//
// English is the default and is served unprefixed (`/about`); every other
// locale is served under its own prefix (`/fr/about`). The prefix-less English
// URLs are rewritten to the `[locale]` segment by the middleware, so existing
// links keep working.

export const LOCALES = ["en", "fr", "es", "de", "ru"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** Display metadata for the language switcher. */
export const LOCALE_LABELS: Record<Locale, { name: string; native: string }> = {
    en: { name: "English", native: "English" },
    fr: { name: "French", native: "Français" },
    es: { name: "Spanish", native: "Español" },
    de: { name: "German", native: "Deutsch" },
    ru: { name: "Russian", native: "Русский" },
};

/** BCP 47 tags used for `<html lang>`, hreflang and Open Graph. */
export const LOCALE_TAGS: Record<Locale, string> = {
    en: "en_US",
    fr: "fr_FR",
    es: "es_ES",
    de: "de_DE",
    ru: "ru_RU",
};

export function isLocale(value: unknown): value is Locale {
    return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/** Coerces anything (route param, cookie, header) to a supported locale. */
export function toLocale(value: unknown): Locale {
    return isLocale(value) ? value : DEFAULT_LOCALE;
}

/**
 * Path for a route in a given locale. The default locale keeps the bare path.
 *
 *   localePath("/about", "en") -> "/about"
 *   localePath("/about", "fr") -> "/fr/about"
 */
export function localePath(path: string, locale: Locale): string {
    const clean = path.startsWith("/") ? path : `/${path}`;
    if (locale === DEFAULT_LOCALE) return clean;
    return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

/** Strips a locale prefix from a pathname, returning the bare route. */
export function stripLocale(pathname: string): { locale: Locale; path: string } {
    const segments = pathname.split("/").filter(Boolean);
    const first = segments[0];

    if (isLocale(first) && first !== DEFAULT_LOCALE) {
        return { locale: first, path: `/${segments.slice(1).join("/")}` };
    }

    return { locale: DEFAULT_LOCALE, path: pathname || "/" };
}
