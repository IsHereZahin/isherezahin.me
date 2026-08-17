import { DEFAULT_LOCALE, isLocale, type Locale } from "@/i18n/config";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/** Remembers an explicit choice from the language switcher. */
const LOCALE_COOKIE = "NEXT_LOCALE";

/**
 * Country → language, for visitors whose browser sends no useful
 * Accept-Language. Only countries whose main language we actually ship.
 */
const COUNTRY_LOCALE: Record<string, Locale> = {
    FR: "fr", BE: "fr", MC: "fr", SN: "fr", CI: "fr",
    ES: "es", MX: "es", AR: "es", CO: "es", CL: "es", PE: "es", VE: "es",
    DE: "de", AT: "de", LI: "de",
    RU: "ru", BY: "ru", KZ: "ru", KG: "ru",
};

/** First supported language in the browser's Accept-Language header. */
function fromAcceptLanguage(header: string | null): Locale | null {
    if (!header) return null;

    const ranked = header
        .split(",")
        .map((part) => {
            const [tag, q] = part.trim().split(";q=");
            return { tag: tag.trim().toLowerCase(), q: q ? Number(q) : 1 };
        })
        .sort((a, b) => b.q - a.q);

    for (const { tag } of ranked) {
        const base = tag.split("-")[0];
        if (isLocale(base)) return base;
    }

    return null;
}

/** Geo header set by the hosting platform (Vercel). */
function fromCountry(request: NextRequest): Locale | null {
    const country = request.headers.get("x-vercel-ip-country");
    return country ? COUNTRY_LOCALE[country.toUpperCase()] ?? null : null;
}

/**
 * Locale for a visitor who has not picked one: their browser's language first,
 * then the country they are browsing from, then English.
 */
function detectLocale(request: NextRequest): Locale {
    return (
        fromAcceptLanguage(request.headers.get("accept-language")) ??
        fromCountry(request) ??
        DEFAULT_LOCALE
    );
}

export function proxy(request: NextRequest) {
    const { nextUrl } = request;
    const { pathname } = nextUrl;

    // Check for auth session cookie
    const sessionToken = request.cookies.get("authjs.session-token")?.value
        || request.cookies.get("__Secure-authjs.session-token")?.value;

    const isAuthenticated = !!sessionToken;

    const segments = pathname.split("/").filter(Boolean);
    const prefix = segments[0];
    const hasPrefix = isLocale(prefix);
    // Route without the locale prefix, used for the auth checks below.
    const route = hasPrefix ? `/${segments.slice(1).join("/")}` : pathname;

    // Protected routes that require a signed-in user at the edge.
    //
    // NOTE: /admin is intentionally NOT gated here. It is the entry point for the
    // Personal Vault: visitors who are not the admin (including anonymous ones)
    // must be able to reach /admin so the client layout can show them the vault
    // access screen instead of the dashboard. Access control for /admin is
    // enforced client-side (admin layout renders the vault-only shell for
    // non-admins) and server-side at the API layer (checkIsAdmin / requireVault /
    // requireVaultAdmin), so no edge redirect is needed or wanted here.
    const protectedRoutes = ["/profile"];
    const isProtectedRoute = protectedRoutes.some((r) => route.startsWith(r));

    if (isProtectedRoute && !isAuthenticated) {
        return NextResponse.redirect(new URL("/", nextUrl.origin));
    }

    // The admin dashboard is English-only.
    const isAdminRoute = route.startsWith("/admin");

    if (!hasPrefix) {
        const chosen = request.cookies.get(LOCALE_COOKIE)?.value;
        // An explicit choice from the switcher wins; otherwise detect once.
        const locale = isLocale(chosen) ? chosen : detectLocale(request);

        // Send non-English visitors to their prefixed URL so the language they
        // land on is reflected in the address bar and can be shared.
        if (locale !== DEFAULT_LOCALE && !isAdminRoute) {
            const url = nextUrl.clone();
            url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
            return NextResponse.redirect(url);
        }

        // English is served unprefixed: `/about` is rewritten to `/en/about`
        // behind the scenes so the URL the visitor sees never changes.
        const url = nextUrl.clone();
        url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
        return NextResponse.rewrite(url);
    }

    // `/en/about` is the same page as `/about` — redirect so each page has one
    // canonical URL rather than two that both resolve.
    if (prefix === DEFAULT_LOCALE) {
        const url = nextUrl.clone();
        url.pathname = route === "/" ? "/" : route;
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Everything except API routes, Next internals and files with extensions.
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest|.*\\..*$).*)",
    ],
};
