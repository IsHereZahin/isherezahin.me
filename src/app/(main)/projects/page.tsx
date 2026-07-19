import ProjectsIndex from "@/components/pages/ProjectsIndex";
import { METADATA } from "@/config/seo.config";
import { getPublishedProjectsPage } from "@/lib/cached-queries";
import { Suspense } from "react";

export const metadata = METADATA.projects;

export default async function ProjectsPage() {
  const initialData = await getPublishedProjectsPage(5);
  // The visible loading skeleton is the route-level loading.tsx. This Suspense
  // exists only to satisfy `useSearchParams` inside ProjectsIndex, so its
  // fallback is empty — otherwise a second, duplicate loader would appear.
  return (
    <Suspense fallback={null}>
      <ProjectsIndex initialData={initialData} />
    </Suspense>
  );
}
