import { Badge, BlurImage, ImageZoom, PageTitle } from "@/components/ui";
import { USES_HERO, USES_PAGE_HEADING } from "@/data";

/** Page title plus the wide workspace photo. */
export default function Hero() {
    return (
        <section className="mb-12 sm:mb-20">
            <PageTitle title={USES_PAGE_HEADING.title} subtitle={USES_PAGE_HEADING.subtitle} />

            <ImageZoom>
                <div className="group relative aspect-video w-full rounded-2xl md:rounded-3xl bg-secondary cursor-zoom-in">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 pointer-events-none rounded-2xl" />

                    <BlurImage src={USES_HERO.image} alt={USES_HERO.alt} className="rounded-2xl" />

                    <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 z-20 flex flex-wrap gap-1 sm:gap-2">
                        {USES_HERO.badges.map((badge) => (
                            <Badge
                                key={badge}
                                variant="secondary"
                                className="bg-popover/80 text-xs backdrop-blur-md border-border text-foreground hover:bg-popover/60"
                            >
                                {badge}
                            </Badge>
                        ))}
                    </div>

                    {/* Decorative gradient blur */}
                    <div className="absolute -bottom-8 sm:-bottom-12 -right-8 sm:-right-12 h-32 sm:h-64 w-32 sm:w-64 bg-gradient-to-br from-primary/10 to-primary/5 blur-3xl transition-opacity opacity-0 group-hover:opacity-100" />
                </div>
            </ImageZoom>
        </section>
    );
}
