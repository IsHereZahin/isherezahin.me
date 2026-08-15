import { BlurImage, ImageZoom, SectionHeader } from "@/components/ui";
import { USES_HARDWARE } from "@/data";
import type { IconComponent } from "@/data/types";

function SpecBadge({ icon: Icon, label }: Readonly<{ icon: IconComponent; label: string }>) {
    return (
        <div className="flex items-center gap-1 rounded-full bg-secondary/5 px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-medium text-foreground ring-1 ring-inset ring-secondary/20 hover:bg-secondary/10 transition-colors">
            <Icon className="h-2.5 sm:h-3 w-2.5 sm:w-3" />
            {label}
        </div>
    );
}

/** Bento grid: primary machine, display, and the smaller devices. */
export default function Hardware() {
    const { heading, primary, display, secondary } = USES_HARDWARE;
    const PrimaryIcon = primary.icon;
    const DisplayIcon = display.icon;

    return (
        <section id="workstation" className="mb-16 sm:mb-24 scroll-mt-24">
            <SectionHeader tag={heading.tag} title={heading.title} subtitle={heading.subtitle} />
            <div className="grid grid-cols-1 gap-2 sm:gap-4 md:grid-cols-4 md:grid-rows-2">
                {/* Main computer */}
                <div className="group relative col-span-1 md:col-span-2 md:row-span-2 overflow-hidden rounded-2xl md:rounded-3xl shadow-feature-card p-4 sm:p-8 transition-all duration-300">
                    <div className="relative z-10 flex h-full flex-col justify-between">
                        <div className="space-y-2 sm:space-y-3">
                            <div className="flex h-8 sm:h-10 w-8 sm:w-10 items-center justify-center rounded-full bg-foreground/5 shadow-feature-card group-hover:bg-foreground/10 transition-colors">
                                <PrimaryIcon className="h-4 sm:h-5 w-4 sm:w-5 text-foreground" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-semibold text-foreground">{primary.title}</h3>
                            <p className="text-sm sm:text-base text-muted-foreground">{primary.subtitle}</p>
                        </div>
                        <div className="mt-4 sm:mt-8 space-y-2 sm:space-y-4">
                            <p className="text-sm sm:text-base leading-relaxed text-muted-foreground group-hover:text-foreground/80">
                                {primary.description}
                            </p>
                            <div className="flex flex-wrap gap-1 sm:gap-2">
                                {primary.specs.map((spec) => (
                                    <SpecBadge key={spec.label} icon={spec.icon} label={spec.label} />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="absolute -bottom-8 sm:-bottom-12 -right-8 sm:-right-12 h-32 sm:h-64 w-32 sm:w-64 bg-gradient-to-br from-primary/10 to-primary/5 blur-3xl transition-opacity opacity-0 group-hover:opacity-100" />
                </div>

                {/* Display */}
                <div className="group relative col-span-1 md:col-span-2 overflow-hidden rounded-2xl md:rounded-3xl shadow-feature-card p-4 sm:p-8 transition-all duration-300">
                    <div className="flex h-full flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6">
                        <div className="space-y-1 sm:space-y-2">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <DisplayIcon className="h-4 sm:h-5 w-4 sm:w-5 text-muted-foreground" />
                                <h3 className="text-base sm:text-lg font-semibold text-foreground">{display.title}</h3>
                            </div>
                            <p className="text-sm sm:text-base text-muted-foreground">{display.subtitle}</p>
                            <p className="text-sm sm:text-base text-muted-foreground max-w-xs group-hover:text-foreground/80 transition-colors">
                                {display.description}
                            </p>
                        </div>
                        <ImageZoom>
                            <div className="relative h-20 sm:h-24 w-full md:w-32 shrink-0 overflow-hidden rounded-lg bg-secondary shadow-feature-card group-hover:border-secondary/30 transition-colors">
                                <BlurImage
                                    src={display.image}
                                    alt={display.imageAlt}
                                    className="object-cover opacity-60"
                                />
                            </div>
                        </ImageZoom>
                    </div>
                </div>

                {/* Smaller devices */}
                {secondary.map(({ icon: Icon, title, subtitle }) => (
                    <div
                        key={title}
                        className="group relative col-span-1 overflow-hidden rounded-2xl shadow-feature-card p-3 sm:p-6 transition-all duration-300"
                    >
                        <div className="space-y-2 sm:space-y-4">
                            <Icon className="h-4 sm:h-5 w-4 sm:w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                            <div>
                                <h3 className="text-sm sm:text-base font-semibold text-foreground">{title}</h3>
                                <p className="text-sm sm:text-base text-muted-foreground group-hover:text-foreground/80 transition-colors">
                                    {subtitle}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
