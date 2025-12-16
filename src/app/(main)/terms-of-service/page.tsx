// src/app/(main)/terms-of-service/page.tsx
import LegalPageIndex from "@/components/pages/LegalPageIndex";
import { LegalPageModel } from "@/database/models/legal-page-model";
import dbConnect from "@/database/services/mongo";
import { BASE_DOMAIN, MY_FULL_NAME } from "@/lib/constants";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    await dbConnect();
    const page = await LegalPageModel.findOne({ slug: "terms-of-service", published: true }).lean() as {
        title: string;
    } | null;

    const title = page?.title || "Terms of Service";
    const description = `Terms of Service for ${MY_FULL_NAME}'s website. Please read these terms carefully before using our services.`;
    const url = `https://${BASE_DOMAIN}/terms-of-service`;

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

export default function TermsOfServicePage() {
    return (
        <LegalPageIndex
            slug="terms-of-service"
            pageTitle="Terms of Service"
            pageSubtitle="Please read these terms carefully before using our services"
        />
    );
}
