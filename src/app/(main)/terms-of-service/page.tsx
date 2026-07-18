// src/app/(main)/terms-of-service/page.tsx
import LegalStaticPage from "@/components/pages/LegalStaticPage";
import { TERMS_OF_SERVICE } from "@/data/legal";
import { BASE_URL, MY_FULL_NAME } from "@/lib/constants";
import type { Metadata } from "next";

const title = `${TERMS_OF_SERVICE.title} | ${MY_FULL_NAME}`;
const description = `Terms of Service for ${MY_FULL_NAME}'s website. Please read these terms carefully before using the site.`;
const url = `${BASE_URL}/terms-of-service`;

export const metadata: Metadata = {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website" },
    twitter: { card: "summary", title, description },
};

export default function TermsOfServicePage() {
    return <LegalStaticPage doc={TERMS_OF_SERVICE} />;
}
