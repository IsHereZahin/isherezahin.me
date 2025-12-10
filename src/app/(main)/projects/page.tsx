import ProjectsIndex from '@/components/pages/ProjectsIndex';
import { ProjectsLoading, TagsLoading } from '@/components/ui';
import { MY_FULL_NAME } from "@/lib/constants";
import type { Metadata } from "next";
import { Suspense } from 'react';

export const metadata: Metadata = {
    title: `Projects | ${MY_FULL_NAME}`,
};

function ProjectsPageFallback() {
    return (
        <section className="px-6 py-16 max-w-5xl mx-auto">
            <TagsLoading />
            <div className="mt-8">
                <ProjectsLoading count={4} />
            </div>
        </section>
    );
}

export default function ProjectsPage() {
    return (
        <Suspense fallback={<ProjectsPageFallback />}>
            <ProjectsIndex />
        </Suspense>
    )
}
