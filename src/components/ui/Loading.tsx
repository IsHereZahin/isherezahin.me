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
        <section className="space-y-6 sm:space-y-8">
            {Array.from({ length: count }).map((_, idx) => (
                <article
                    key={idx + 1}
                    className="py-6 sm:py-8 border-t border-border/30"
                >
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start sm:items-center">
                        {/* Content Section - Below image on mobile, left on sm+ */}
                        <div className="w-full flex-1 min-w-0 order-2 sm:order-none space-y-2 sm:space-y-3">
                            {/* Date */}
                            <Skeleton className="h-3 sm:h-4 w-24 sm:w-28 rounded" />

                            {/* Title */}
                            <Skeleton className="h-5 sm:h-6 w-3/4 sm:w-full sm:max-w-md rounded" />

                            {/* Excerpt */}
                            <div className="w-full space-y-2">
                                <Skeleton className="h-3 sm:h-4 w-full rounded" />
                                <Skeleton className="h-3 sm:h-4 w-[90%] rounded" />
                                <Skeleton className="h-3 sm:h-4 w-[75%] rounded" />
                            </div>
                        </div>

                        {/* Image - Top on mobile, right on sm+ */}
                        <Skeleton className="w-full sm:w-48 lg:w-56 xl:w-64 h-40 sm:h-32 lg:h-40 xl:h-48 rounded-lg flex-shrink-0 order-first sm:order-none" />
                    </div>

                    {/* Metadata Row - Read time, Views, and Tags */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 pt-3 sm:pt-4">
                        <div className="flex items-center gap-3 sm:gap-6">
                            {/* Read Time */}
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <Skeleton className="h-3.5 w-3.5 sm:h-4 sm:w-4 rounded" />
                                <Skeleton className="h-3 sm:h-4 w-16 sm:w-20 rounded" />
                            </div>
                            {/* Views */}
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <Skeleton className="h-3.5 w-3.5 sm:h-4 sm:w-4 rounded" />
                                <Skeleton className="h-3 sm:h-4 w-14 sm:w-16 rounded" />
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 sm:ml-auto mt-2 sm:mt-0">
                            <Skeleton className="h-5 sm:h-6 w-14 sm:w-16 rounded-md" />
                            <Skeleton className="h-5 sm:h-6 w-12 sm:w-14 rounded-md" />
                            <Skeleton className="h-5 sm:h-6 w-16 sm:w-18 rounded-md" />
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

// Fixed widths to avoid hydration mismatch from Math.random()
const TAG_WIDTHS = [72, 88, 64, 96, 80, 68, 92, 76];

export function TagsLoading() {
    return (
        <div className="mt-4 sm:mt-6 flex flex-wrap items-baseline justify-start gap-1.5 sm:gap-2">
            {TAG_WIDTHS.map((width, idx) => (
                <Skeleton
                    key={idx}
                    className="h-6 sm:h-7 rounded-md"
                    style={{ width: `${width}px` }}
                />
            ))}
        </div>
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

export function ProfileSessionsLoading() {
    return (
        <section className="border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-5 w-36" />
            </div>
            <div className="space-y-3">
                {[1, 2].map((i) => (
                    <div
                        key={i}
                        className="border border-border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                    >
                        <div className="flex items-start gap-3">
                            <Skeleton className="h-9 w-9 rounded-lg" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                        </div>
                        <Skeleton className="h-9 w-20 rounded-md" />
                    </div>
                ))}
            </div>
        </section>
    );
}