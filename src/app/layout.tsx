import dbConnect from "@/database/services/mongo";
import { MY_DESIGNATION, MY_FULL_NAME, SITE_USER_LOGO } from "@/lib/constants";
import ProviderIndex from "@/providers/ProviderIndex";
import type { Metadata } from "next";

dbConnect();

export const metadata: Metadata = {
  title: `${MY_FULL_NAME} | ${MY_DESIGNATION}`,
  description: `${MY_FULL_NAME} is a ${MY_DESIGNATION} from Cox's Bazar, Bangladesh, specializing in building high-performance and elegant web applications using React, Node.js, Laravel, and other modern web technologies.`,
  openGraph: {
    title: `${MY_FULL_NAME} | ${MY_DESIGNATION}`,
    description: `Explore ${MY_FULL_NAME}'s portfolio, web development projects, and blog posts. Learn more about web technologies and personal insights.`,
    url: "https://isherezahin.vercel.app",
    siteName: "isherezahin.me",
    images: [
      {
        url: SITE_USER_LOGO,
        width: 1200,
        height: 630,
        alt: `${MY_FULL_NAME} Portfolio`,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${MY_FULL_NAME} | ${MY_DESIGNATION}`,
    description: `Check out ${MY_FULL_NAME}'s portfolio, blog, and projects, and discover more about his journey as a web developer.`,
    images: [SITE_USER_LOGO],
  },
};

export default function MainRootLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background">
        <ProviderIndex>
          {children}
        </ProviderIndex>
      </body>
    </html>
  );
}