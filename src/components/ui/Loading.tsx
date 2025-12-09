import { Skeleton } from "./skeleton";

export function BlogDetailsLoading() {
    return (
        <section className="px-4 sm:px-6 pt-8 sm:pt-16 max-w-[900px] mx-auto">
            <div className="space-y-6 sm:space-y-8">

                {/* Title + Subtitle */}
                <div className="text-center space-y-3 sm:space-y-4">
                    <Skeleton className="h-8 sm:h-10 w-full max-w-[280px] sm:max-w-[384px] mx-auto rounded-lg" />
                    <Skeleton className="h-4 sm:h-5 w-full max-w-[200px] sm:max-w-[288px] mx-auto rounded" />
                </div>

                {/* Author Meta */}
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-6 sm:h-8 sm:w-8 rounded-full" />
                        <Skeleton className="h-3 sm:h-4 w-16 sm:w-20 rounded" />
                    </div>
                    <Skeleton className="h-3 sm:h-4 w-20 sm:w-28 rounded" />
                    <Skeleton className="hidden sm:block h-4 w-20 rounded" />
                    <Skeleton className="hidden sm:block h-4 w-20 rounded" />
                </div>

                {/* Featured Hero Image */}
                <Skeleton className="aspect-[16/9] w-full rounded-xl sm:rounded-2xl mt-4 sm:mt-8" />

                {/* Sidebar-like Summary Box */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8 mt-8 sm:mt-12">
                    {/* Main Content Area */}
                    <div className="md:col-span-3 space-y-4 sm:space-y-6">
                        {/* Summary Title */}
                        <Skeleton className="h-6 sm:h-7 w-28 sm:w-32 rounded-lg" />

                        {/* Summary Bullet Points */}
                        <div className="space-y-2 sm:space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex items-start gap-2 sm:gap-3">
                                    <Skeleton className="h-4 w-4 sm:h-5 sm:w-5 rounded shrink-0 mt-0.5" />
                                    <Skeleton className="h-3 sm:h-4 w-full max-w-lg rounded" />
                                </div>
                            ))}
                        </div>

                        {/* Body Paragraphs */}
                        <div className="space-y-3 sm:space-y-4 mt-6 sm:mt-10">
                            <Skeleton className="h-5 sm:h-6 w-32 sm:w-48 rounded-lg" />
                            {[...Array(8)].map((_, i) => (
                                <Skeleton
                                    key={i}
                                    className={`h-3 sm:h-4 rounded ${i % 3 === 0 ? "w-full" : i % 3 === 1 ? "w-11/12" : "w-9/12"}`}
                                />
                            ))}
                        </div>

                        {/* Conclusion Section */}
                        <div className="mt-8 sm:mt-12 space-y-3 sm:space-y-4">
                            <Skeleton className="h-5 sm:h-6 w-48 sm:w-64 rounded-lg" />
                            {[...Array(6)].map((_, i) => (
                                <Skeleton key={i} className="h-3 sm:h-4 w-full rounded" />
                            ))}
                        </div>
                    </div>

                    {/* Right Sidebar - "On this page" - Hidden on mobile */}
                    <aside className="hidden md:block md:col-span-1">
                        <Skeleton className="h-6 w-32 mb-6 rounded-lg" />
                        <div className="space-y-3">
                            {[...Array(4)].map((_, i) => (
                                <Skeleton key={i} className="h-4 w-full max-w-[160px] rounded" />
                            ))}
                        </div>

                        {/* Author Card at bottom-right */}
                        <div className="mt-12 flex items-center gap-4">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32 rounded" />
                                <Skeleton className="h-3 w-24 rounded" />
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    );
}

export function BlogsLoading({ count = 3 }: { readonly count?: number }) {
    return (
        <section className="space-y-8">
            {Array.from({ length: count }).map((_, idx) => (
                <article
                    key={idx + 1}
                    className="flex flex-col md:flex-row gap-8 py-8 border-b border-border last:border-0"
                >
                    {/* Left: Text Content */}
                    <div className="flex-1 min-w-0 space-y-5">
                        {/* Date */}
                        <Skeleton className="h-4 w-32 rounded-md" />

                        {/* Title */}
                        <Skeleton className="h-10 w-full max-w-3xl rounded-lg" />

                        {/* Description (3 lines with natural variation) */}
                        <div className="space-y-3">
                            <Skeleton className="h-5 w-full rounded-md" />
                            <Skeleton className="h-5 w-11/12 rounded-md" />
                            <Skeleton className="h-5 w-4/5 rounded-md" />
                        </div>

                        {/* Bottom Stats: Read time + Views */}
                        <div className="flex items-center gap-6 pt-4">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-4 rounded" />
                                <Skeleton className="h-4 w-20 rounded-md" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-4 rounded" />
                                <Skeleton className="h-4 w-24 rounded-md" />
                            </div>
                        </div>
                    </div>

                    {/* Right: Image + Tags (aligned to the right edge) */}
                    <div className="flex flex-col items-end gap-4">
                        {/* Thumbnail - properly sized and aligned */}
                        <Skeleton className="w-full max-w-sm md:w-60 lg:w-76 aspect-[5/3] rounded-xl" />

                        {/* Tags directly under the image, right-aligned */}
                        <div className="flex flex-wrap justify-end gap-2">
                            <Skeleton className="h-8 w-24 rounded-full" />
                            <Skeleton className="h-8 w-20 rounded-full" />
                            <Skeleton className="h-8 w-28 rounded-full" />
                        </div>
                    </div>
                </article>
            ))}
        </section>
    );
}

export function SingleCommentLoading() {
    return (
        <article className="flex flex-col shadow-feature-card rounded-xl bg-background px-6 py-8">
            <div className="flex gap-4">
                <div className="flex-1 space-y-4">
                    <div className="flex items-center">
                        <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
                        <div className="ml-4 flex-1 space-y-2">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-5 w-40 rounded-md" />
                                <Skeleton className="h-5 w-20 rounded-full" />
                            </div>
                            <Skeleton className="h-4 w-28 rounded-md" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full rounded-md" />
                        <Skeleton className="h-4 w-11/12 rounded-md" />
                        <Skeleton className="h-4 w-3/4 rounded-md" />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-6">
                            <Skeleton className="h-6 w-10 rounded-sm" />
                            <Skeleton className="h-6 w-10 rounded-sm" />
                        </div>

                        <div className="flex items-center gap-2">
                            <Skeleton className="h-6 w-15 rounded-sm" />
                            <Skeleton className="h-6 w-15 rounded-sm" />
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}

export function CommentsLoading({ count = 3 }: { readonly count?: number }) {
    return (
        <section className="bg-background">
            {/* Header */}
            <div className="flex items-center justify-between py-6 px-6">
                <Skeleton className="h-8 w-32 rounded-md" />
                <Skeleton className="h-8 w-20 rounded-md" />
            </div>

            {/* Comment List */}
            <div className="gap-4 flex flex-col">
                {[...Array(count)].map((_, idx) => (
                    <SingleCommentLoading key={idx + 1} />
                ))}
            </div>
        </section>
    );
}

export function ProjectDetailsLoading() {
    return (
        <section className="px-4 sm:px-6 pt-8 sm:pt-16 max-w-[1000px] mx-auto">
            <div className="space-y-6 sm:space-y-8">
                {/* Category Badge */}
                <div className="text-center">
                    <Skeleton className="h-5 sm:h-6 w-20 sm:w-24 mx-auto rounded-full" />
                </div>

                {/* Title + Subtitle */}
                <div className="text-center space-y-3 sm:space-y-4">
                    <Skeleton className="h-8 sm:h-12 w-full max-w-[280px] sm:max-w-[384px] mx-auto rounded-lg" />
                    <Skeleton className="h-4 sm:h-5 w-full max-w-[240px] sm:max-w-[320px] mx-auto rounded" />
                </div>

                {/* Project Meta Info */}
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-3 w-3 sm:h-4 sm:w-4 rounded" />
                        <Skeleton className="h-3 sm:h-4 w-16 sm:w-24 rounded" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-3 w-3 sm:h-4 sm:w-4 rounded" />
                        <Skeleton className="h-3 sm:h-4 w-14 sm:w-20 rounded" />
                    </div>
                    <div className="hidden sm:flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded" />
                        <Skeleton className="h-4 w-28 rounded" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-2 w-2 rounded-full" />
                        <Skeleton className="h-3 sm:h-4 w-14 sm:w-20 rounded" />
                    </div>
                </div>

                {/* Project Image */}
                <Skeleton className="aspect-[16/9] w-full rounded-xl sm:rounded-2xl mt-6 sm:mt-12" />

                {/* Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 sm:gap-12 mt-8 sm:mt-12">
                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-6 sm:space-y-8">
                        {/* Action Buttons */}
                        <div className="flex gap-2 sm:gap-3">
                            <Skeleton className="h-9 sm:h-10 w-24 sm:w-32 rounded-lg" />
                            <Skeleton className="h-9 sm:h-10 w-20 sm:w-28 rounded-lg" />
                        </div>

                        {/* Tech Stack Tags */}
                        <div className="flex flex-wrap gap-2">
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-5 sm:h-6 w-16 sm:w-20 rounded-full" />
                            ))}
                        </div>

                        {/* Content Sections */}
                        <div className="space-y-4 sm:space-y-6">
                            <Skeleton className="h-6 sm:h-8 w-24 sm:w-32 rounded-lg" />
                            {[...Array(6)].map((_, i) => (
                                <Skeleton
                                    key={i}
                                    className={`h-3 sm:h-4 rounded ${i % 3 === 0 ? "w-full" : i % 3 === 1 ? "w-11/12" : "w-9/12"}`}
                                />
                            ))}
                        </div>

                        <div className="space-y-4 sm:space-y-6 mt-6 sm:mt-8">
                            <Skeleton className="h-6 sm:h-8 w-32 sm:w-40 rounded-lg" />
                            {[...Array(4)].map((_, i) => (
                                <Skeleton key={i} className="h-3 sm:h-4 w-full rounded" />
                            ))}
                        </div>
                    </div>

                    {/* Sidebar - Hidden on mobile */}
                    <aside className="hidden lg:block lg:col-span-1">
                        <Skeleton className="h-6 w-32 mb-6 rounded-lg" />
                        <div className="space-y-3">
                            {[...Array(4)].map((_, i) => (
                                <Skeleton key={i} className="h-4 w-full rounded" />
                            ))}
                        </div>

                        {/* Like Button */}
                        <div className="mt-8">
                            <Skeleton className="h-12 w-32 rounded-xl" />
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    );
}

export function ProjectsLoading({ count = 4 }: { readonly count?: number }) {
    return (
        <section className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
                {Array.from({ length: count }).map((_, idx) => (
                    <article
                        key={idx + 1}
                        className="space-y-4 group relative rounded-lg overflow-hidden p-4 sm:p-6"
                    >
                        {/* Project Image */}
                        <Skeleton className="aspect-[16/10] w-full rounded-lg" />

                        {/* Content */}
                        <div className="space-y-3">
                            {/* Title and Status */}
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-6 w-48 rounded" />
                                <Skeleton className="h-4 w-20 rounded" />
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full rounded" />
                                <Skeleton className="h-4 w-11/12 rounded" />
                                <Skeleton className="h-4 w-4/5 rounded" />
                            </div>

                            {/* View Project Link */}
                            <Skeleton className="h-6 w-24 rounded mt-4" />
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}