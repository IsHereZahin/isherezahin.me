import Section from "@/components/ui/Section"

export function BlogDetailsLoading() {
    return (
        <Section id="blog-loading" className="px-6 pt-16 max-w-[800px] mx-auto">
            <div className="animate-pulse space-y-6">
                {/* Title */}
                <div className="h-8 bg-secondary rounded w-2/3 mx-auto"></div>

                {/* Meta info */}
                <div className="flex justify-center gap-4 mt-4">
                    <div className="h-4 bg-secondary rounded w-20"></div>
                    <div className="h-4 bg-secondary rounded w-16"></div>
                    <div className="h-4 bg-secondary rounded w-24"></div>
                </div>

                {/* Featured image */}
                <div className="h-30 sm:h-40 md:h-64 bg-secondary rounded-xl mt-6"></div>

                {/* Paragraphs */}
                <div className="space-y-4 mt-8">
                    <div className="h-4 bg-secondary rounded w-full"></div>
                    <div className="h-4 bg-secondary rounded w-5/6"></div>
                    <div className="h-4 bg-secondary rounded w-4/6"></div>
                    <div className="h-4 bg-secondary rounded w-full"></div>
                    <div className="h-4 bg-secondary rounded w-3/4"></div>
                </div>
            </div>
        </Section>
    )
}

export function BlogsLoading({ count = 3 }: { readonly count?: number }) {
    return (
        <Section id="blogs-loading">
            <div className="space-y-8">
                {Array.from({ length: count }).map((_, idx) => (
                    <div key={idx + 1} className="animate-pulse space-y-4 border-b border-border pb-6">
                        {/* Title */}
                        <div className="h-6 bg-secondary rounded w-2/3"></div>

                        {/* Meta info */}
                        <div className="flex gap-4 mt-2">
                            <div className="h-4 bg-secondary rounded w-20"></div>
                            <div className="h-4 bg-secondary rounded w-16"></div>
                        </div>

                        {/* Excerpt */}
                        <div className="space-y-2 mt-2">
                            <div className="h-4 bg-secondary rounded w-full"></div>
                            <div className="h-4 bg-secondary rounded w-5/6"></div>
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    );
}