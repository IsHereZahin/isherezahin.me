import { Section, Skeleton } from "@/components/ui";

// Shown instantly while a saylo is fetched on the server, so clicking through
// from the list navigates straight away instead of waiting on the database.
export default function Loading() {
    return (
        <Section id="saylo-detail" className="px-4 sm:px-6 py-12 sm:py-16 max-w-2xl">
            <div className="space-y-4 rounded-2xl shadow-feature-card p-5">
                <div className="flex items-center gap-3">
                    <Skeleton className="size-10 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-3.5 w-32" />
                        <Skeleton className="h-3 w-20" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-11/12" />
                    <Skeleton className="h-4 w-4/5" />
                </div>
                <Skeleton className="h-56 w-full rounded-xl" />
            </div>
        </Section>
    );
}
