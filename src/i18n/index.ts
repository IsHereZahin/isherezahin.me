// src/i18n/index.ts
//
// Dictionary loading. Each locale is a separate module loaded on demand, so a
// page only ever ships the language it is rendering.

import { DEFAULT_LOCALE, type Locale } from "./config";
import { en, type Dictionary } from "./dictionaries/en";

const loaders: Record<Locale, () => Promise<Dictionary>> = {
    en: async () => en,
    fr: () => import("./dictionaries/fr").then((m) => m.fr),
    es: () => import("./dictionaries/es").then((m) => m.es),
    de: () => import("./dictionaries/de").then((m) => m.de),
    ru: () => import("./dictionaries/ru").then((m) => m.ru),
};

/**
 * Copy for a locale. Falls back to English if the locale is unknown or its
 * module fails to load, so a page never renders blank.
 */
export async function getDictionary(locale: Locale): Promise<Dictionary> {
    const load = loaders[locale] ?? loaders[DEFAULT_LOCALE];

    try {
        return await load();
    } catch {
        return en;
    }
}

export { en };
export type { Dictionary };
export * from "./config";
