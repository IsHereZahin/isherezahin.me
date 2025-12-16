// src/app/(main)/privacy-policy/page.tsx
import LegalPageIndex from "@/components/pages/LegalPageIndex";
import { LegalPageModel } from "@/database/models/legal-page-model";
import dbConnect from "@/database/services/mongo";
import { BASE_DOMAIN, MY_FULL_NAME } from "@/lib/constants";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    await dbConnect();
    const page = await LegalPageModel.findOne({ slug: "privacy-policy", published: true }).lean() as {
        title: string;
    } | null;

    const title = page?.title || "Privacy Policy";
    const description = `Privacy Policy for ${MY_FULL_NAME}'s website. Learn how we collect, use, and protect your personal information.`;
    const url = `https://${BASE_DOMAIN}/privacy-policy`;

    return {
        title: `${title} | ${MY_FULL_NAME}`,
        description,
        openGraph: {
            title: `${title} | ${MY_FULL_NAME}`,
            description,
            url,
            type: "website",
        },
        twitter: {
            card: "summary",
            title: `${title} | ${MY_FULL_NAME}`,
            description,
        },
    };
}

export default function PrivacyPolicyPage() {
    return (
        <LegalPageIndex
            slug="privacy-policy"
            pageTitle="Privacy Policy"
            pageSubtitle="How we collect, use, and protect your personal information"
        />
    );
}
