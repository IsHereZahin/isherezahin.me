import SayloDetailsIndex from "@/components/pages/SayloDetailsIndex";
import { PERSON, TWITTER, getFullUrl } from "@/config/seo.config";
import dbConnect from "@/database/services/mongo";
import { SayloModel } from "@/database/models/saylo-model";
import { UserModel } from "@/database/models/user-model";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

// Ensure User model is registered for population
const _UserModel = UserModel;

interface SayloPageProps {
    params: Promise<{ id: string }>;
}

interface SayloDocument {
    _id: { toString(): string };
    content: string;
    authorId: { name?: string } | null;
    category: string | null;
    images: string[];
    videos: string[];
    published: boolean;
    createdAt: Date;
}

async function getSaylo(id: string) {
    try {
        await dbConnect();
        const saylo = await SayloModel.findById(id).populate("authorId", "name").lean() as SayloDocument | null;
        if (!saylo?.published) return null;
        return {
            id: saylo._id.toString(),
            content: saylo.content,
            authorName: saylo.authorId?.name || null,
            category: saylo.category || null,
            images: saylo.images || [],
            videos: saylo.videos || [],
            createdAt: saylo.createdAt,
        };
    } catch {
        return null;
    }
}

export async function generateMetadata({
    params,
}: SayloPageProps): Promise<Metadata> {
    const { id } = await params;
    const saylo = await getSaylo(id);

    if (!saylo) {
        return {
            title: "Saylo Not Found",
        };
    }

    const contentPreview = saylo.content.length > 160
        ? saylo.content.substring(0, 160) + "..."
        : saylo.content;

    const title = `${saylo.authorName || PERSON.name.first}'s Saylo`;
    const description = contentPreview;
    const url = getFullUrl(`/saylo/${id}`);

    const hasImages = saylo.images.length > 0;
    const hasVideos = saylo.videos.length > 0;

    return {
        title,
        description,
        authors: [{ name: saylo.authorName || PERSON.name.full, url: getFullUrl() }],
        openGraph: {
            title,
            description,
            url,
            type: "article",
            publishedTime: saylo.createdAt?.toISOString(),
            ...(hasImages && {
                images: saylo.images.map((img) => ({
                    url: img,
                    alt: title,
                })),
            }),
            ...(hasVideos && {
                videos: saylo.videos.map((video) => ({
                    url: video,
                })),
            }),
        },
        twitter: {
            card: hasImages ? "summary_large_image" : "summary",
            site: TWITTER.site,
            creator: TWITTER.creator,
            title,
            description,
            ...(hasImages && { images: [saylo.images[0]] }),
        },
        alternates: {
            canonical: url,
        },
    };
}

export default async function SayloPage({ params }: Readonly<SayloPageProps>) {
    const { id } = await params;
    const saylo = await getSaylo(id);

    if (!saylo) {
        notFound();
    }

    return <SayloDetailsIndex id={id} />;
}
