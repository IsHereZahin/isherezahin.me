export interface SectionHeaderProps {
    tag?: string;
    title: string;
    subtitle?: string;
}

export default function SectionHeader({ tag, title, subtitle }: Readonly<SectionHeaderProps>) {
    return (
        <div className="mb-8 sm:mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-3 sm:gap-4">
            <div>
                <span className="mb-2 block text-xs font-mono uppercase tracking-widest text-muted-foreground">
                    {tag}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                    {title}
                </h2>
            </div>
            <p className="max-w-md text-sm sm:text-base text-muted-foreground hover:text-foreground/80 transition-colors md:text-right pb-1">
                {subtitle}
            </p>
        </div>
    );
}