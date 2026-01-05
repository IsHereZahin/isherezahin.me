import ProjectsIndex from "@/components/pages/ProjectsIndex";
import { ProjectsLoading, TagsLoading } from "@/components/ui";
import { METADATA } from "@/config/seo.config";
import { Suspense } from "react";

export const metadata = METADATA.projects;

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
  );
}
