import ThemeScript from "@/components/layouts/ThemeScript";
import dbConnect from "@/database/services/mongo";
import ProviderIndex from "@/providers/ProviderIndex";

export { VIEWPORT_CONFIG as viewport, ROOT_METADATA as metadata } from "@/config/seo.config";

dbConnect();

/**
 * The real root layout — deliberately free of the `[locale]` param.
 *
 * Next.js can only swap a root layout with a full document navigation, so if
 * `<html>` lived under `[locale]` every language switch would reload the page
 * and remount everything, providers and all. Keeping the document shell here
 * makes a locale change an ordinary client-side navigation; `[locale]/layout`
 * below only swaps the dictionary. The `lang` attribute is kept in step by
 * `DictionaryProvider`.
 */
export default function RootLayout({ children }: { readonly children: React.ReactNode }) {
    return (
        <html lang="en" data-theme="black-white" suppressHydrationWarning>
            <head>
                <ThemeScript />
                <link rel="preconnect" href="https://res.cloudinary.com" />
                <link rel="preconnect" href="https://avatars.githubusercontent.com" />
                <link rel="dns-prefetch" href="https://res.cloudinary.com" />
                <link rel="dns-prefetch" href="https://avatars.githubusercontent.com" />
            </head>
            <body className="bg-background">
                <ProviderIndex>{children}</ProviderIndex>
            </body>
        </html>
    );
}
