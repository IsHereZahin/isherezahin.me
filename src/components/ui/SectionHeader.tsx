import { SectionHeaderProps } from "@/utils/types";

export default function SectionHeader({ title, subtitle }: Readonly<SectionHeaderProps>) {
    return (
        <div className="mb-8">
            <h2 className="text-2xl text-foreground font-bold">{title}</h2>
            {subtitle && <p className="text-foreground text-lg">{subtitle}</p>}
        </div>
    );
}