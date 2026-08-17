import ThemeScript from "@/components/layouts/ThemeScript";
import dbConnect from "@/database/services/mongo";
import ProviderIndex from "@/providers/ProviderIndex";

export { VIEWPORT_CONFIG as viewport, ROOT_METADATA as metadata } from "@/config/seo.config";

dbConnect();

/**
 * Document shell. Kept free of the `[locale]` param so switching language is a
 * client-side navigation. `lang` is set by `DictionaryProvider`.
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
