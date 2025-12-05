// src/app/(main)/projects/[slug]/page.tsx
import ProjectDetailsIndex from "@/components/pages/ProjectDetailsIndex";
import { ProjectModel } from "@/database/models/project-model";
import dbConnect from "@/database/services/mongo";
import { BASE_DOMAIN, MY_FULL_NAME } from "@/lib/constants";
import type { Metadata } from "next";

interface ProjectDetailsPageProps {
    params: { slug: string };
}

export async function generateMetadata({ params }: ProjectDetailsPageProps): Promise<Metadata> {
    const { slug } = await params;
    await dbConnect();
    const project = await ProjectModel.findOne({ slug, published: true }).lean() as {
        title: string;
        excerpt: string;
        imageSrc: string;
    } | null;

    if (!project) {
        return {
            title: "Project Not Found",
        };
    }

    const title = `${project.title} | ${MY_FULL_NAME}`;
    const description = project.excerpt;
    const url = `https://${BASE_DOMAIN}/projects/${slug}`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url,
            type: "article",
            images: [
                {
                    url: project.imageSrc,
                    width: 1200,
                    height: 630,
                    alt: project.title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [project.imageSrc],
        },
    };
}

export default async function ProjectDetailsPage({ params }: Readonly<ProjectDetailsPageProps>) {
    const { slug } = await params;

    return <ProjectDetailsIndex slug={slug} />;
}
