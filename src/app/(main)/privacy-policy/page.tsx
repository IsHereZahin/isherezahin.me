// src/app/(main)/privacy-policy/page.tsx
import LegalStaticPage from "@/components/pages/LegalStaticPage";
import { PRIVACY_POLICY } from "@/data/legal";
import { BASE_URL, MY_FULL_NAME } from "@/lib/constants";
import type { Metadata } from "next";

const title = `${PRIVACY_POLICY.title} | ${MY_FULL_NAME}`;
const description = `Privacy Policy for ${MY_FULL_NAME}'s website. Learn how your personal information is collected, used, and protected.`;
const url = `${BASE_URL}/privacy-policy`;

export const metadata: Metadata = {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website" },
    twitter: { card: "summary", title, description },
};

export default function PrivacyPolicyPage() {
    return <LegalStaticPage doc={PRIVACY_POLICY} />;
}
