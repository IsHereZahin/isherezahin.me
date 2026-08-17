import { ProjectsLoading, TagsLoading } from "@/components/ui";

// Shown instantly while the /projects page is fetched/rendered on the server.
export default function Loading() {
    return (
        <section className="px-6 py-16 max-w-5xl mx-auto">
            <TagsLoading />
            <div className="mt-8">
                <ProjectsLoading count={4} />
            </div>
        </section>
    );
}
