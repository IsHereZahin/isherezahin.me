// src/app/(main)/projects/[slug]/page.tsx
import ProjectDetailsIndex from "@/components/pages/ProjectDetailsIndex";

interface ProjectDetailsPageProps {
    params: { slug: string };
}

export default async function ProjectDetailsPage({ params }: Readonly<ProjectDetailsPageProps>) {
    const { slug } = await params;

    return <ProjectDetailsIndex slug={slug} />;
}
