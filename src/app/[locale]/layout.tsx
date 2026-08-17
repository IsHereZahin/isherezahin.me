import { getDictionary } from "@/i18n";
import { LOCALES, toLocale } from "@/i18n/config";
import DictionaryProvider from "@/i18n/DictionaryProvider";
import { notFound } from "next/navigation";

/** Prerender every locale. */
export function generateStaticParams() {
    return LOCALES.map((locale) => ({ locale }));
}

/**
 * Nested under the document shell in `app/layout.tsx`, so switching language is
 * a client-side navigation rather than a page load: only this subtree and the
 * dictionary change.
 */
export default async function LocaleLayout({
    children,
    params,
}: {
    readonly children: React.ReactNode;
    readonly params: Promise<{ locale: string }>;
}) {
    const { locale: raw } = await params;

    // The middleware only ever routes known locales here; anything else that
    // slips through is a 404 rather than a silent fallback to English.
    if (!LOCALES.includes(raw as (typeof LOCALES)[number])) notFound();

    const locale = toLocale(raw);
    const dict = await getDictionary(locale);

    return (
        <DictionaryProvider locale={locale} dict={dict}>
            {children}
        </DictionaryProvider>
    );
}
