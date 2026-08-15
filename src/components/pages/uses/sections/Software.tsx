import { SectionHeader } from "@/components/ui";
import { USES_SOFTWARE } from "@/data";
import type { SoftwareEntry } from "@/data/types";

function SoftwareItem({ icon: Icon, name, category, description }: Readonly<SoftwareEntry>) {
    return (
        <div className="group flex flex-col gap-3 sm:gap-4 py-4 sm:py-6 md:flex-row md:items-center md:justify-between transition-all hover:bg-secondary/3 px-2 sm:px-4 -mx-2 sm:-mx-4 rounded-xl">
            <div className="flex items-start md:items-center gap-3 sm:gap-4">
                <div className="flex h-10 sm:h-12 w-10 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-secondary dark:bg-accent/70 ring-1 ring-border group-hover:ring-secondary/30 transition-all">
                    <Icon className="h-5 sm:h-6 w-5 sm:w-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <div>
                    <h4 className="font-semibold text-foreground">{name}</h4>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">{category}</span>
                </div>
            </div>
            <p className="max-w-md text-sm sm:text-base text-muted-foreground md:text-right group-hover:text-foreground/80 transition-colors">
                {description}
            </p>
        </div>
    );
}

export default function Software() {
    const { heading, items } = USES_SOFTWARE;

    return (
        <section id="stack" className="mb-16 sm:mb-24 scroll-mt-24">
            <SectionHeader tag={heading.tag} title={heading.title} subtitle={heading.subtitle} />
            <div className="divide-y divide-border border-t border-b border-border">
                {items.map((item) => (
                    <SoftwareItem key={item.name} {...item} />
                ))}
            </div>
        </section>
    );
}
