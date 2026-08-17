"use client";

import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import { DEFAULT_LOCALE, localePath, type Locale } from "./config";
import { en, type Dictionary } from "./dictionaries/en";

interface I18nValue {
    locale: Locale;
    dict: Dictionary;
    /** Prefixes an in-site path with the active locale. */
    path: (href: string) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

/**
 * Makes the active locale's copy available to client components — the header,
 * footer and empty states, which sit outside any page and so cannot receive it
 * as a prop. The dictionary is plain data, so passing it across the server
 * boundary is just serialisation.
 */
export default function DictionaryProvider({
    locale,
    dict,
    children,
}: {
    readonly locale: Locale;
    readonly dict: Dictionary;
    readonly children: ReactNode;
}) {
    const value = useMemo<I18nValue>(
        () => ({ locale, dict, path: (href: string) => localePath(href, locale) }),
        [locale, dict]
    );

    // `<html>` lives in the param-less root layout so language switches stay
    // client-side, which means its `lang` has to follow the locale from here.
    useEffect(() => {
        document.documentElement.lang = locale;
    }, [locale]);

    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/** Copy and locale helpers for client components. Falls back to English. */
export function useI18n(): I18nValue {
    return (
        useContext(I18nContext) ?? {
            locale: DEFAULT_LOCALE,
            dict: en,
            path: (href: string) => href,
        }
    );
}
