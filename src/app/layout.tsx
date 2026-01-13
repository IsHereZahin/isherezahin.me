import { SITE } from "@/config/seo.config";
import dbConnect from "@/database/services/mongo";
import ProviderIndex from "@/providers/ProviderIndex";

export { VIEWPORT_CONFIG as viewport, ROOT_METADATA as metadata,  } from "@/config/seo.config";

dbConnect();

export default function MainRootLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang={SITE.language} data-theme="black-white" suppressHydrationWarning>
      <head>
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