import { Section, SectionHeader } from "@/components/ui";
import type { AboutContent } from "@/data/pages/about";
import EducationItem from "../components/EducationItem";

export default function Education({ heading, items }: Readonly<AboutContent["education"]>) {

    if (items.length === 0) return null;

    return (
        <Section id="education" animate delay={0.2} className="px-6 py-10 max-w-[1000px]">
            <SectionHeader tag={heading.tag} title={heading.title} subtitle={heading.subtitle} />
            <div>
                {items.map((item) => (
                    <EducationItem key={`${item.institution}-${item.degree}`} {...item} />
                ))}
            </div>
        </Section>
    );
}
