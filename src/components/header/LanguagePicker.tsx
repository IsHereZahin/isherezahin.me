"use client";

import FlagIcon from "@/components/ui/FlagIcon";
import { LOCALES, LOCALE_LABELS, localePath, stripLocale } from "@/i18n/config";
import { Check } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface LanguagePickerProps {
    /** Closes the popup that owns this list. */
    onSelect?: () => void;
}

/**
 * Language list for the header popup. Each entry is a real link to the same
 * page in that locale, so switching language is a normal navigation that can be
 * bookmarked, shared and crawled — and because `<html>` sits above the
 * `[locale]` segment, it happens client-side without reloading the page.
 */
export default function LanguagePicker({ onSelect }: Readonly<LanguagePickerProps>) {
    const pathname = usePathname() || "/";
    const { locale: current, path } = stripLocale(pathname);

    const choose = (locale: string) => {
        // Pin the choice for a year so location-based detection does not
        // override it on the next visit.
        document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; samesite=lax`;
        onSelect?.();
    };

    return (
        <ul className="flex flex-col gap-0.5" aria-label="Language">
            {LOCALES.map((locale) => {
                const { native } = LOCALE_LABELS[locale];
                const isActive = locale === current;

                return (
                    <li key={locale}>
                        <Link
                            href={localePath(path, locale)}
                            onClick={() => choose(locale)}
                            scroll={false}
                            hrefLang={locale}
                            aria-current={isActive ? "true" : undefined}
                            className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors ${isActive
                                ? "bg-accent text-foreground"
                                : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                                }`}
                        >
                            <FlagIcon locale={locale} className="h-3.5 w-5 shrink-0" />
                            <span className="flex-1 text-left">{native}</span>
                            {isActive && <Check className="size-3.5 shrink-0" />}
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
}
