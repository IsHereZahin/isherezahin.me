import { SectionHeader } from "@/components/ui";
import type { UsesContent } from "@/data/pages/uses";
import type { PeripheralEntry } from "@/data/types";

function PeripheralCard({
    icon: Icon,
    title,
    subtitle,
    description,
}: Readonly<PeripheralEntry>) {
    return (
        <div className="group rounded-2xl shadow-feature-card p-4 sm:p-6 transition-all duration-300">
            <div className="mb-3 sm:mb-4 inline-flex h-8 sm:h-10 w-8 sm:w-10 items-center justify-center rounded-lg shadow-feature-card bg-foreground/5 text-muted-foreground group-hover:text-foreground group-hover:bg-foreground/10 transition-colors">
                <Icon className="h-4 sm:h-5 w-4 sm:w-5" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-foreground">{title}</h3>
            <span className="mb-2 sm:mb-3 block text-xs font-medium text-secondary-foreground/70">
                {subtitle}
            </span>
            <p className="text-sm sm:text-base leading-relaxed text-muted-foreground group-hover:text-foreground/80 transition-colors">
                {description}
            </p>
        </div>
    );
}

export default function Peripherals({ heading, items }: Readonly<UsesContent["peripherals"]>) {

    return (
        <section id="peripherals" className="mb-16 sm:mb-24 scroll-mt-24">
            <SectionHeader tag={heading.tag} title={heading.title} subtitle={heading.subtitle} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {items.map((item) => (
                    <PeripheralCard key={item.title} {...item} />
                ))}
            </div>
        </section>
    );
}
